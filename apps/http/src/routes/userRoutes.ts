import { Router } from "express";
import {
  changePass,
  signin,
  signup,
  userExists,
} from "../controller/userController";
import { authMiddleware } from "../middleware/authenticated";
const user: any = Router();
user.post("/signup", signup);
user.post("/signin", signin);
user.post("/me", userExists);
user.post("/resetPassword", authMiddleware, changePass);
export { user };
