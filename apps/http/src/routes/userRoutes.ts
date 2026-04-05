import { Router } from "express";
import {
  changePass,
  signin,
  signup,
  userExists,
  whoAmI,
} from "../controller/userController";
import { authMiddleware } from "../middleware/authenticated";
const user: any = Router();
user.post("/signup", signup);
user.post("/signin", signin);
user.post("/me", userExists);
user.get("/details", authMiddleware, whoAmI);
user.post("/resetPassword", authMiddleware, changePass);
export { user };
