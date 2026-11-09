/// <reference path="./types/express.d.ts" />
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import iotRoutes from "./routes/iot.routes.js";
import commandRoutes from "./routes/command.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

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

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/devices", commandRoutes);

export default app;
