import { Router } from "express";
import { getNodes, nodeCreation } from "../controller/nodeController";

const nodeRoutes: any = Router();
nodeRoutes.post("/:workflowId", nodeCreation);
nodeRoutes.get("/getNode/:nodeId", getNodes);

export default nodeRoutes;
