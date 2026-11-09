import express from "express";
import cors from "cors";
import authRouter from "../src/routes/auth.routes"
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "IoT Control API",
    status: "ONLINE"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    service: "IoT Control Backend"
  });
});

app.use("/api/auth", authRouter)

export default app;
