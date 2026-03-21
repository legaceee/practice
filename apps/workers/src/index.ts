import "dotenv/config";
import { prisma } from "@repo/db";
import { sendEmail } from "./services/sendEmail.js";
import { retry } from "./retry.js";
import { actionRegistry } from "./utils/actionRegistry.js";

const POLL_INTERVAL_MS = 2000;
const ERROR_RETRY_MS = 5000;

async function claimNextExecutionAtomically() {
  return prisma.$transaction(async (tx) => {
    const nextExecution = await tx.workflowRun.findFirst({
      where: {
        status: { in: ["pending"] },
      },
      orderBy: {
        startedAt: "asc",
      },
    });

    if (!nextExecution) {
      return null;
    }

    const claimedExecution = await tx.workflowRun.updateMany({
      where: {
        id: nextExecution.id,
        status: { in: ["pending"] },
      },
      data: {
        status: "executing",
        startedAt: new Date(),
        finishedAt: null,
      },
    });

    if (claimedExecution.count === 0) {
      return null;
    }

    return tx.workflowRun.findUnique({
      where: {
        id: nextExecution.id,
      },
      include: {
        workflow: {
          include: {
            nodes: true,
          },
        },
      },
    });
  });
}

async function processExecutions() {
  console.log("worker started...");
  while (true) {
    try {
      const workflowRun = await claimNextExecutionAtomically();

      if (!workflowRun) {
        await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
        continue;
      }
      const context = {
        trigger: workflowRun.triggerData,
        steps: {},
      };

      await runWorkflow(workflowRun, context);
    } catch (error) {
      await new Promise((res) => setTimeout(res, ERROR_RETRY_MS));
    }
  }
}

async function runWorkflow(execution: any, context: any) {
  let workflowRunId: string | undefined;

  try {
    workflowRunId = execution.id;

    const actionNodes = execution.workflow.nodes
      .filter((n: any) => n.type === "action")
      .sort((a: any, b: any) => a.order - b.order);

    for (const node of actionNodes) {
      await retry(
        () => executeNode(node, context, workflowRunId as string),
        3,
        2000,
      );
    }

    await prisma.workflowRun.update({
      where: { id: workflowRunId },
      data: {
        status: "completed",
        finishedAt: new Date(),
      },
    });

    console.log("Execution completed:", execution.id);
  } catch (error) {
    console.error("Execution failed:", error);

    if (workflowRunId) {
      await prisma.workflowRun
        .update({
          where: { id: workflowRunId },
          data: {
            status: "failed",
            finishedAt: new Date(),
          },
        })
        .catch(() => null);
    }
  }
}

async function executeNode(node: any, context: any, workflowRunId: string) {
  console.log("Executing node:", node.service, node.config);
  const exsiting = await prisma.actionExecution.findFirst({
    where: {
      workflowRunId,
      actionId: node.id.toString(),
    },
  });
  if (exsiting) {
    console.log("skipping duplicate execution", node.id);
    return;
  }
  const log = await prisma.executionLog.create({
    data: {
      workflowRunId,
      step: node.service,
      status: "running",
    },
  });

  try {
    const handler = actionRegistry[node.service];
    if (!handler) {
      throw new Error(`NO HANDLER REGISTRY ${node.service}`);
    }
    const res = await handler(node.config, context);
    context.steps[node.id] = res;
    await prisma.executionLog.update({
      where: { id: log.id },
      data: { status: "success" },
    });
    await prisma.actionExecution.create({
      data: {
        workflowRunId,
        actionId: node.id.toString(),
        status: "success",
      },
    });
  } catch (error: any) {
    await prisma.executionLog.update({
      where: { id: log.id },
      data: { status: "failed", message: error.message },
    });
    throw error;
  }
}
processExecutions();
