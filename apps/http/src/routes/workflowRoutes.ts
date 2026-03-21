import { Router } from "express";
import { createWorkflow } from "../controller/workflowController.js";

const workflowRoutes: any = Router();

workflowRoutes.post("/", createWorkflow);

export default workflowRoutes;
