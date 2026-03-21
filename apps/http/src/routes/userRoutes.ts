import { Router } from "express";
import { signin, signup } from "../controller/userController";
const user: any = Router();
user.post("/signup", signup);
user.post("/signin", signin);
export { user };
