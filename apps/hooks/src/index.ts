import express, { Request, Response } from "express";
import "dotenv/config";
import { prisma } from "@repo/db";
const app = express();
app.use(express.json());
const port = process.env.PORT2 || 3000;

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

    await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: "executing",
        triggerData: payload,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(port);
