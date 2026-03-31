import { Router } from "express";
import {
  createWorkflow,
  deleteWorkflow,
  getWorkflow,
} from "../controller/workflowController.js";
import { authMiddleware } from "../middleware/authenticated.js";

const workflowRoutes: any = Router();

workflowRoutes.get("/workflow/:workflowId", authMiddleware, getWorkflow);
workflowRoutes.post("/", authMiddleware, createWorkflow);
workflowRoutes.delete("/delete/:workflowId", deleteWorkflow);

export default workflowRoutes;
