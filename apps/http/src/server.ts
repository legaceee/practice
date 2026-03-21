import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import workflowRoutes from "./routes/workflowRoutes.js";
import { user } from "./routes/userRoutes.js";

const port = process.env.PORT || 3001;
const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use("/workflows", workflowRoutes);
app.use("/auth", user);

app.get("/", async (req, res) => {
  // const data = await prisma.user.findFirst();
  res.send("Hello world");
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
