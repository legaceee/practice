import "dotenv/config";
import { prisma } from "@repo/db";
import { sendEmail } from "./services/sendEmail.js";
import { retry } from "./retry.js";
async function processExecutions() {
  console.log("worker started...");
  while (true) {
    try {
      const execution = await prisma.$transaction(async (tx) => {
        const job = await tx.execution.findFirst({
          where: { status: "pending" },
          orderBy: { startedAt: "asc" },
          include: {
            workflow: { include: { nodes: true } },
          },
        });
        if (!job) return null;
        return tx.execution.update({
          where: { id: job.id },
          data: { status: "executing" },
        });
      });

      if (!execution) {
        await new Promise((res) => setTimeout(res, 2000));
        continue;
      }
      console.log("processing", execution.id);
      await runWorkflow(execution);
    } catch (error) {
      console.log("worker error", error);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

async function runWorkflow(execution: any) {
  try {
    const actionNodes = execution.workflow.nodes
      .filter((n: any) => n.type === "action")
      .sort((a: any, b: any) => a.order - b.order);

    for (const node of actionNodes) {
      await retry(() => executeNode(node, execution), 3, 2000);
    }

    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "completed",
        endedAt: new Date(),
      },
    });

    console.log("Execution completed:", execution.id);
  } catch (error) {
    console.error("Execution failed:", error);

    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "failed",
        endedAt: new Date(),
      },
    });
  }
}
async function executeNode(node: any, execution: any) {
  console.log("Executing node:", node.service, node.config);
  const log = await prisma.executionLog.create({
    data: {
      workflowRunId: execution.id,
      step: node.service,
      status: "running",
    },
  });
  try {
    switch (node.service) {
      case "console":
        console.log("console action:", execution.triggerData);
        break;
      case "webhook":
        const data = await fetch(node.config.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(execution.triggerData),
        });
        console.log("this is the webhook fetch", data);
        break;
      case "mail":
        await sendEmail(node.config, execution.triggerData);
        break;

      default:
        console.log("unknown service :", node.service);
    }
    await prisma.executionLog.update({
      where: { id: log.id },
      data: { status: "success" },
    });
  } catch (error: any) {
    await prisma.executionLog.update({
      where: { id: log.id },
      data: { status: "failed", message: error.message },
    });
    throw Error;
  }
}
processExecutions();
