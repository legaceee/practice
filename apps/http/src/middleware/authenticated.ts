import jwt from "jsonwebtoken";
import { AuthRequest } from "../utils/authRequest";

export const authMiddleware = (req: AuthRequest, res: any, next: any) => {
  const token = req.headers.authorization?.split("")[1];
  if (!token) return res.sendStatus(401);
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
