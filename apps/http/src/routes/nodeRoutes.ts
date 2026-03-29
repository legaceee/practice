import { Router } from "express";
import {
  deleteNode,
  getNode,
  getNodesByWorkflow,
  nodeCreation,
  updateNode,
} from "../controller/nodeController";

const nodeRoutes: any = Router();
nodeRoutes.post("/:workflowId", nodeCreation);
nodeRoutes.get("/getNode/:nodeId", getNode);
nodeRoutes.get("/getAllNode/:workflowId", getNodesByWorkflow);
nodeRoutes.patch("/:nodeId", updateNode);
nodeRoutes.delete("/:nodeId", deleteNode);

export default nodeRoutes;
