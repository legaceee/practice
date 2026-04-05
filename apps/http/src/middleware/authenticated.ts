import jwt from "jsonwebtoken";
import { AuthRequest } from "../utils/authRequest";

export const authMiddleware = (req: AuthRequest, res: any, next: any) => {
  const token =
    req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1]; //this gets added by the frontend
  if (!token) {
    console.log("no token");
    return res.sendStatus(401);
  }
  console.log("token cookie", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(403);
  }
};
