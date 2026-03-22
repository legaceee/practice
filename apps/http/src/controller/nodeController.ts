import prisma from "@repo/db";

export const nodeCreation = async (req: any, res: any) => {
  try {
    const workflowId = req.params.workflow;
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

export const getNodes = async (req: any, res: any) => {
  try {
    const nodeId = req.params.nodeId;
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
      data: {
        node,
      },
    });
  } catch (err) {
    console.error("something went wrong");
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};
