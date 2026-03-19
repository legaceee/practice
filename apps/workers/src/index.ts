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
        status: { in: ["pending", "executing"] },
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
        status: { in: ["pending", "executing"] },
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
      const execution = await claimNextExecutionAtomically();

      if (!execution) {
        await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
        continue;
      }
      const context = {
        trigger: execution.triggerData,
        steps: {},
      };

      await runWorkflow(execution);
    } catch (error) {
      await new Promise((res) => setTimeout(res, ERROR_RETRY_MS));
    }
  }
}

async function runWorkflow(execution: any) {
  let workflowRunId: string | undefined;

  try {
    const workflowRun = await prisma.workflowRun.create({
      data: {
        workflowId: execution.workflowId,
        status: "executing",
      },
    });

    workflowRunId = workflowRun.id;

    const actionNodes = execution.workflow.nodes
      .filter((n: any) => n.type === "action")
      .sort((a: any, b: any) => a.order - b.order);

    for (const node of actionNodes) {
      await retry(
        () => executeNode(node, execution, workflowRunId as string),
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

async function executeNode(node: any, execution: any, workflowRunId: string) {
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
    await handler(node.config, execution.triggerData);
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
