
import express from "express";
import cors from "cors";

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

export default app;
