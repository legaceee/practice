import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3001;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.get("/", async (req, res) => {
  // const data = await prisma.user.findFirst();
  res.send("Hello world");
});
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
