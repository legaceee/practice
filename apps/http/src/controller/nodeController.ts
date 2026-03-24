import { prisma } from "@repo/db";
import { Request, Response } from "express";
type nodeInput = {
  type: string;
  service: string;
  config: JSON;
  order: Number;
};
function parseNode(body: any): {
  data?: nodeInput;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { error: "Invalid payload" };
  }
  if (body.type === "trigger" || body.type === "action") {
    const type = body.type;
  }
  if (body.type !== "trigger" || body.type === "service") {
    return { error: "not proper type" };
  }
  const service = typeof body.service === "string" ? body.service.trim() : "";
  if (!service) {
    return { error: "empty service" };
  }
  const config = body.config;
  if (!config || typeof config !== "object") {
    return { error: "empty config is not required" };
  }
  const order = Number(body.order);
  if (!order) {
    return { error: "order should be number" };
  }
  return {
    type,
    service,
    config,
    order,
  };
}
export const nodeCreation = async (req: Request, res: Response) => {
  try {
    const workflowId = parseInt(req.params.workflow as string);
    const { type, service, config, order } = req.body;
    if (!type || !service || !config || order === undefined) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
      },
    });
    if (!workflow) {
      return res.status(400).json({
        message: "please enter a valid workflow id",
      });
    }
    const node = await prisma.node.create({
      data: {
        workflowId,
        type: type,
        service: service,
        config: config,
        order: order,
      },
    });
    res.status(200).json({
      message: `success fully created node ${node.id}`,
    });
  } catch (err) {
    console.error("something went wrong");
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const getNode = async (req: Request, res: Response) => {
  try {
    const nodeId = parseInt(req.params.nodeId as string);
    if (!nodeId) {
      return res.status(400).json({
        message: "node id is required",
      });
    }
    const node = await prisma.node.findUnique({
      where: {
        id: nodeId,
      },
    });
    if (!node) {
      return res.status(404).json({
        message: "node not found",
      });
    }
    res.status(200).json({
      message: "success",
      data: node,
    });
  } catch (err) {
    console.error("something went wrong");
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
