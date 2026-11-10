
import { Router } from "express";

import { createDevice, getDevices, getDeviceById, deleteDevice} from "../controllers/device.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createDevice);

router.get("/", getDevices);

router.get("/:id", getDeviceById);

router.delete("/:id", deleteDevice);

export default router;