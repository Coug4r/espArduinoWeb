import { Router } from "express";

import { deviceMiddleWare } from "../middlewares/device.middleware";

import { heartBeat } from "../controllers/iot.controller";

import {
  nextCommand,
  ackCommand
} from "../controllers/command.controller";

const router = Router();

router.use(deviceMiddleWare);

router.post("/heartbeat", heartBeat);

router.get("/commands/next", nextCommand);

router.post("/commands/:id/ack", ackCommand);

export default router;
