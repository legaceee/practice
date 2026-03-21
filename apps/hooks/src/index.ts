import express, { Request, Response } from "express";
import "dotenv/config";
import { prisma } from "@repo/db";
const app = express();
app.use(express.json());
const port = process.env.PORT2 || 3000;
console.log(process.env.DATABASE_URL, "this was the set value");

app.post("/hooks/:workflowId", async (req, res) => {
  try {
    const workflowId = parseInt(req.params.workflowId);
    const payload = req.body;

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { nodes: true },
    });

    if (!workflow || !workflow.isActive) {
      return res.status(404).json({ message: "Workflow not active" });
    }

    await prisma.workflowRun.create({
      data: {
        workflowId: workflow.id,
        status: "pending",
        triggerData: payload,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.post("/hooks/create/:node", async (req, res) => {
  try {
    const workflowId = parseInt(req.params.node);
    const payload = req.body;
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId },
    });
    if (!workflow || !workflowId) {
      return res.status(401).json({
        message: "workflow doesnt exist",
      });
    }
    await prisma.node.create({
      data: {
        workflowId: workflow.id,
        type: payload.type,
        service: payload.service,
        config: payload.config,
        order: Number(payload.order),
      },
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});
app.listen(port);
