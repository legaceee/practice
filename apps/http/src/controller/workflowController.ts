import type { NextFunction, Request, Response } from "express";
import { prisma } from "@repo/db";
import { asyncHandler } from "../utils/tryCatch";
import { AppError } from "../utils/errorHandler";
import { AuthRequest } from "../utils/authRequest";

type NodeInput = {
  type: string;
  service: string;
  config: any;
  order: number;
};

type WorkflowInput = {
  name: string;
  isActive: boolean;
  nodes: NodeInput[];
};
type updateWorkflow = {
  name?: string;
  isActive?: boolean;
};

const MAX_NAME_LENGTH = 120;
const MAX_NODES = 100;
const RESERVED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasReservedKeys(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasReservedKeys(item));
  }

  if (!isRecord(value)) {
    return false;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (RESERVED_KEYS.has(key)) {
      return true;
    }

    if (hasReservedKeys(nestedValue)) {
      return true;
    }
  }

  return false;
}

function getAuthenticatedUserId(req: Request): number | null {
  const fromLocals = Number((resLocalUser(req) ?? "").toString());
  if (Number.isInteger(fromLocals) && fromLocals > 0) {
    return fromLocals;
  }

  const headerUserId = req.header("x-user-id");
  const fromHeader = Number(headerUserId);
  if (Number.isInteger(fromHeader) && fromHeader > 0) {
    return fromHeader;
  }

  const cookieUserId = req.cookies?.userId;
  const fromCookie = Number(cookieUserId);
  if (Number.isInteger(fromCookie) && fromCookie > 0) {
    return fromCookie;
  }

  return null;
}

function resLocalUser(req: Request): unknown {
  const candidate = (req as Request & { res?: Response }).res?.locals?.userId;
  return candidate;
}

function parseWorkflowInput(body: unknown): {
  data?: WorkflowInput;
  error?: string;
} {
  if (!isRecord(body)) {
    return { error: "Invalid payload" }; //checking if the data is object not null and not array
  }

  const rawName = body.name;
  if (typeof rawName !== "string") {
    //if name is not string return
    return { error: "name is required" };
  }

  const name = rawName.trim(); //trim extra spaces from name
  if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
    return { error: `name must be 1-${MAX_NAME_LENGTH} characters` };
  }

  const rawIsActive = body.isActive;
  const isActive = rawIsActive === undefined ? true : Boolean(rawIsActive); //if rawIsActive is not defined set the default true val else rawisactive

  const rawNodes = body.nodes;
  if (!Array.isArray(rawNodes)) {
    return { error: "nodes must be an array" };
  }

  if (rawNodes.length === 0 || rawNodes.length > MAX_NODES) {
    return { error: `nodes must contain 1-${MAX_NODES} items` };
  }

  const validatedNodes: NodeInput[] = [];
  const seenOrders = new Set<number>();

  for (let index = 0; index < rawNodes.length; index += 1) {
    const rawNode = rawNodes[index];
    if (!isRecord(rawNode)) {
      return { error: `nodes[${index}] must be an object` };
    }

    const type = typeof rawNode.type === "string" ? rawNode.type.trim() : "";
    if (!type) {
      return { error: `nodes[${index}].type is required` };
    }

    const service =
      typeof rawNode.service === "string" ? rawNode.service.trim() : "";
    if (!service || service.length > 60) {
      return { error: `nodes[${index}].service is invalid` };
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(service)) {
      return { error: `nodes[${index}].service format is invalid` };
    }

    const order = Number(rawNode.order);
    if (!Number.isInteger(order) || order < 0 || order > 100_000) {
      return { error: `nodes[${index}].order must be an integer 0-100000` };
    }

    if (seenOrders.has(order)) {
      return { error: `nodes[${index}].order must be unique` }; //dont let order be given again
    }
    seenOrders.add(order);

    const config = rawNode.config;
    if (config === undefined) {
      return { error: `nodes[${index}].config is required` };
    }

    if (hasReservedKeys(config)) {
      return { error: `nodes[${index}].config contains forbidden keys` };
    }

    validatedNodes.push({
      type,
      service,
      config,
      order,
    });
  }

  return {
    data: {
      name,
      isActive,
      nodes: validatedNodes,
    },
  };
}

export async function createWorkflow(req: AuthRequest, res: Response) {
  const userId = Number(req.userId);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data, error } = parseWorkflowInput(req.body);
  if (error || !data) {
    return res.status(400).json({ message: error ?? "Invalid payload" });
  }

  try {
    const created = await prisma.$transaction(
      async (tx) => {
        const workflow = await tx.workflow.create({
          data: {
            name: data.name,
            userId,
            isActive: data.isActive,
          },
        });

        await tx.node.createMany({
          data: data.nodes.map((node) => ({
            workflowId: workflow.id,
            type: node.type,
            service: node.service,
            config: node.config,
            order: node.order,
          })),
        });

        return tx.workflow.findUnique({
          where: { id: workflow.id },
          include: {
            nodes: {
              orderBy: {
                order: "asc",
              },
            },
          },
        });
      },
      { maxWait: 5000, timeout: 30000 },
    );

    return res.status(201).json({ workflow: created });
  } catch (error) {
    console.error("Create workflow failed", {
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}
function parseBoolean(value: unknown): boolean | null {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
}
function parseUpdateWorkflow(body: unknown): {
  data?: updateWorkflow;
  error?: string;
} {
  if (!isRecord(body)) {
    return { error: "body should be record" };
  }
  const updateWorkflow: updateWorkflow = {};
  if ("name" in body) {
    if (typeof body.name !== "string") {
      return { error: "name must be a string" };
    }
    const name = body.name.trim();
    if (hasReservedKeys(name)) {
      return { error: "name contains restricted keywords" };
    }
    if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
      return { error: `name must be 1-${MAX_NAME_LENGTH} characters` };
    }

    updateWorkflow.name = name;
  }
  if ("isActive" in body) {
    const isActive = parseBoolean(body.isActive);
    if (!isActive) {
      return { error: "isActive should be either true or false" };
    }
    updateWorkflow.isActive = isActive;
  }
  return { data: updateWorkflow };
}

export const updateWorkflow = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = Number(req.userId);
    if (!userId || isNaN(userId)) {
      throw new AppError("not authorised", 401);
    }

    const workflowId = Number(req.params.workflowId);
    if (!workflowId || isNaN(workflowId)) {
      throw new AppError("workflow id should be a number", 400);
    }
    const workflow = await prisma.workflow.findFirst({
      where: {
        userId: userId,
        id: workflowId,
      },
    });
    if (!workflow) {
      throw new AppError("user does not have any workflow", 400);
    }
    const { data, error } = parseUpdateWorkflow(req.body);
    if (error || !data) {
      throw new AppError("body should have proper data", 400);
    }
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data,
    });
    res.status(200).json({
      message: updatedWorkflow,
    });
    next();
  },
);

export const deleteWorkflow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const workflowId = req.params.workflowId;
    if (!workflowId) {
      throw new AppError("workflow id is required", 400);
    }
    const parseWorkflowId = Number(workflowId);
    if (isNaN(parseWorkflowId)) {
      throw new AppError("workflow id should be number", 400);
    }
    console.log(parseWorkflowId);
    // const deleteWorkflow = await prisma.workflow.delete({
    //   where: {
    //     id: parseWorkflowId,
    //   },
    //   include: {
    //     nodes: true,
    //   },
    // });
    await prisma.$transaction(
      async (tx) => {
        await tx.node.deleteMany({
          where: {
            workflowId: parseWorkflowId,
          },
        });
        await tx.workflow.delete({
          where: { id: parseWorkflowId },
        });
      },
      { maxWait: 5000, timeout: 30000 },
    );
    if (!deleteWorkflow) {
      throw new AppError("Workflow doesnt exist", 404);
    }
    res.status(200).json({
      message: `workflow ${parseWorkflowId} deleted successfully`,
    });
    next();
  },
);

export const getWorkflow = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("not authorised", 201);
    }
    const workflowId = Number(req.params.workflowId);
    if (!workflowId || isNaN(workflowId)) {
      throw new AppError("workflow id is required", 501);
    }
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
      },
      select: {
        nodes: true,
      },
    });
    if (!workflow) {
      throw new AppError("workflow does not exists", 500);
    }
    res.status(200).json({
      message: workflow,
    });
    next();
  },
);
export const deleteAllWorkflow = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = Number(req.userId);
    if (!userId || isNaN(userId)) {
      throw new AppError("not authenticated", 401);
    }
    const deleteAll = await prisma.workflow.deleteMany({
      where: {
        userId: userId,
      },
    });
    if (!deleteAll) {
      throw new AppError("user does not have any workflow", 400);
    }
    res.status(200).json({
      message: `workflow deleted for user ${userId}`,
    });
    next();
  },
);
