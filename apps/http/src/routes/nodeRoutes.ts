import { Router } from "express";
import { getNode, nodeCreation } from "../controller/nodeController";

const nodeRoutes: any = Router();
nodeRoutes.post("/:workflowId", nodeCreation);
nodeRoutes.get("/getNode/:nodeId", getNode);

export default nodeRoutes;
