import "dotenv/config";
import { prisma } from "@repo/db";
import { sendEmail } from "./services/sendEmail.js";
async function processExecutions() {
  console.log("worker started...");
  while (true) {
    try {
      const execution = await prisma.execution.findFirst({
        where: { status: "executing" },
        include: {
          workflow: {
            include: { nodes: true },
          },
        },
      });
      if (!execution) {
        await new Promise((res) => setTimeout(res, 2000));
        continue;
      }
      console.log("process execution", execution.id);
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
      await executeNode(node, execution.triggerData);
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
async function executeNode(node: any, triggerData: any) {
  console.log("Executing node:", node.service, node.config);
  switch (node.service) {
    case "console":
      console.log("console action:", triggerData);
      break;
    case "webhook":
      await fetch(node.config.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(triggerData),
      });
      break;
    case "mail":
      await sendEmail(node.config, triggerData);
      break;

    default:
      console.log("unknown service :", node.service);
  }
}
processExecutions();
