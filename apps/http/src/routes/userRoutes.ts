import { Router } from "express";
import {
  changePass,
  refresh,
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
user.post("/refresh", refresh);
export { user };
