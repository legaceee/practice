import { prisma } from "@repo/db";
import type { Request, Response } from "express";
import type { AuthRequest } from "../utils/authRequest";

type NodeTypeValue = "TRIGGER" | "ACTION";
type ServiceTypeValue = "EMAIL" | "WEBHOOK";
type JsonInputValue =
  | string
  | number
  | boolean
  | { [key: string]: JsonInputValue }
  | JsonInputValue[];

type NodeCreateInput = {
  type: NodeTypeValue;
  service: ServiceTypeValue;
  config: JsonInputValue;
  order: number;
};

type NodeUpdateInput = Partial<NodeCreateInput>;

const RESERVED_KEYS = new Set(["__proto__", "prototype", "constructor"]);
const MAX_ORDER = 100_000;

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

  for (const [key, nested] of Object.entries(value)) {
    if (RESERVED_KEYS.has(key)) {
      return true;
    }

    if (hasReservedKeys(nested)) {
      return true;
    }
  }

  return false;
}

function isJsonValue(value: unknown): value is JsonInputValue {
  const valueType = typeof value;
  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isJsonValue(item));
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((item) => isJsonValue(item));
}

function parsePositiveInt(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parseOrder(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > MAX_ORDER) {
    return null;
  }
  return parsed;
}

function normalizeNodeType(value: unknown): NodeTypeValue | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (normalized === "TRIGGER" || normalized === "ACTION") {
    return normalized;
  }

  return null;
}

function normalizeService(value: unknown): ServiceTypeValue | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (normalized === "EMAIL" || normalized === "WEBHOOK") {
    return normalized;
  }

  return null;
}

function getAuthenticatedUserId(req: Request): number | null {
  const authReq = req as AuthRequest;
  const fromReq = parsePositiveInt(authReq.userId);
  if (fromReq) {
    return fromReq;
  }

  const fromHeader = parsePositiveInt(req.header("x-user-id"));
  if (fromHeader) {
    return fromHeader;
  }

  const fromCookie = parsePositiveInt(req.cookies?.userId);
  if (fromCookie) {
    return fromCookie;
  }

  return null;
}

function parseNodeCreateInput(body: unknown): {
  data?: NodeCreateInput;
  error?: string;
} {
  if (!isRecord(body)) {
    return { error: "Invalid payload" };
  }

  const type = normalizeNodeType(body.type);
  if (!type) {
    return { error: "type must be TRIGGER or ACTION" };
  }

  const service = normalizeService(body.service);
  if (!service) {
    return { error: "service must be EMAIL or WEBHOOK" };
  }

  if (!("config" in body)) {
    return { error: "config is required" };
  }

  const config = body.config;
  if (config === null || config === undefined) {
    return { error: "config must be valid JSON data" };
  }

  if (!isJsonValue(config)) {
    return { error: "config must be valid JSON data" };
  }

  if (hasReservedKeys(config)) {
    return { error: "config contains forbidden keys" };
  }

  const order = parseOrder(body.order);
  if (order === null) {
    return { error: `order must be an integer between 0 and ${MAX_ORDER}` };
  }

  return {
    data: {
      type,
      service,
      config,
      order,
    },
  };
}

function parseNodeUpdateInput(body: unknown): {
  data?: NodeUpdateInput;
  error?: string;
} {
  if (!isRecord(body)) {
    return { error: "Invalid payload" };
  }

  const updates: NodeUpdateInput = {};

  if ("type" in body) {
    const type = normalizeNodeType(body.type);
    if (!type) {
      return { error: "type must be TRIGGER or ACTION" };
    }
    updates.type = type;
  }

  if ("service" in body) {
    const service = normalizeService(body.service);
    if (!service) {
      return { error: "service must be EMAIL or WEBHOOK" };
    }
    updates.service = service;
  }

  if ("config" in body) {
    const config = body.config;
    if (config === null || config === undefined) {
      return { error: "config must be valid JSON data" };
    }
    if (!isJsonValue(config)) {
      return { error: "config must be valid JSON data" };
    }
    if (hasReservedKeys(config)) {
      return { error: "config contains forbidden keys" };
    }
    updates.config = config;
  }

  if ("order" in body) {
    const order = parseOrder(body.order);
    if (order === null) {
      return { error: `order must be an integer between 0 and ${MAX_ORDER}` };
    }
    updates.order = order;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "At least one updatable field is required" };
  }

  return { data: updates };
}

function sanitizeNode(node: {
  id: number;
  workflowId: number;
  type: string;
  service: string;
  config: unknown;
  order: number;
}) {
  return {
    id: node.id,
    workflowId: node.workflowId,
    type: node.type,
    service: node.service,
    config: node.config,
    order: node.order,
  };
}

async function ensureOrderAvailable(
  workflowId: number,
  order: number,
  ignoreNodeId?: number,
) {
  const existing = await prisma.node.findFirst({
    where: {
      workflowId,
      order,
      ...(ignoreNodeId ? { id: { not: ignoreNodeId } } : {}),
    },
    select: { id: true },
  });

  return !existing;
}

export const nodeCreation = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const workflowId = parsePositiveInt(req.params.workflowId);
  if (!workflowId) {
    return res
      .status(400)
      .json({ message: "workflowId must be a positive integer" });
  }

  const { data, error } = parseNodeCreateInput(req.body);
  if (error || !data) {
    return res.status(400).json({ message: error ?? "Invalid payload" });
  }

  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId,
      },
      select: { id: true },
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const isOrderAvailable = await ensureOrderAvailable(workflowId, data.order);
    if (!isOrderAvailable) {
      return res
        .status(409)
        .json({ message: "A node with this order already exists" });
    }

    const node = await prisma.node.create({
      data: {
        workflowId,
        type: data.type,
        service: data.service,
        config: data.config,
        order: data.order,
      },
    });

    return res.status(201).json({
      message: "Node created successfully",
      data: sanitizeNode(node),
    });
  } catch (err) {
    console.error("Node creation failed", {
      workflowId,
      userId,
      error: err instanceof Error ? err.message : "unknown",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNode = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const nodeId = parsePositiveInt(req.params.nodeId);
  if (!nodeId) {
    return res
      .status(400)
      .json({ message: "nodeId must be a positive integer" });
  }

  try {
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        workflow: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    if (node.workflow.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ data: sanitizeNode(node) });
  } catch (err) {
    console.error("Node fetch failed", {
      nodeId,
      userId,
      error: err instanceof Error ? err.message : "unknown",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNodesByWorkflow = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const workflowId = parsePositiveInt(req.params.workflowId);
  if (!workflowId) {
    return res
      .status(400)
      .json({ message: "workflowId must be a positive integer" });
  }

  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const nodes = await prisma.node.findMany({
      where: { workflowId },
      orderBy: { order: "asc" },
    });

    return res.status(200).json({
      count: nodes.length,
      data: nodes.map((node) => sanitizeNode(node)),
    });
  } catch (err) {
    console.error("Node list failed", {
      workflowId,
      userId,
      error: err instanceof Error ? err.message : "unknown",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNode = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const nodeId = parsePositiveInt(req.params.nodeId);
  if (!nodeId) {
    return res
      .status(400)
      .json({ message: "nodeId must be a positive integer" });
  }

  const { data, error } = parseNodeUpdateInput(req.body);
  if (error || !data) {
    return res.status(400).json({ message: error ?? "Invalid payload" });
  }

  try {
    const existing = await prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        workflow: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Node not found" });
    }

    if (existing.workflow.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (typeof data.order === "number") {
      const isOrderAvailable = await ensureOrderAvailable(
        existing.workflowId,
        data.order,
        existing.id,
      );
      if (!isOrderAvailable) {
        return res
          .status(409)
          .json({ message: "A node with this order already exists" });
      }
    }

    const updated = await prisma.node.update({
      where: { id: nodeId },
      data,
    });

    return res.status(200).json({
      message: "Node updated successfully",
      data: sanitizeNode(updated),
    });
  } catch (err) {
    console.error("Node update failed", {
      nodeId,
      userId,
      error: err instanceof Error ? err.message : "unknown",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNode = async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const nodeId = parsePositiveInt(req.params.nodeId);
  if (!nodeId) {
    return res
      .status(400)
      .json({ message: "nodeId must be a positive integer" });
  }

  try {
    const existing = await prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        workflow: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Node not found" });
    }

    if (existing.workflow.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.node.delete({ where: { id: nodeId } });
    return res.status(204).send();
  } catch (err) {
    console.error("Node delete failed", {
      nodeId,
      userId,
      error: err instanceof Error ? err.message : "unknown",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};
