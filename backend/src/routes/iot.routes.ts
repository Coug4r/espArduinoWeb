import { Router } from "express";

import { deviceMiddleWare } from "../middlewares/device.middleware.js";

import { heartBeat } from "../controllers/iot.controller.js";

import {
  nextCommand,
  ackCommand
} from "../controllers/command.controller.js";

const router = Router();

router.use(deviceMiddleWare);

router.post("/heartbeat", heartBeat);

router.get("/commands/next", nextCommand);

router.post("/commands/:id/ack", ackCommand);

export default router;
