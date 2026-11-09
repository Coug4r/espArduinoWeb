import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  createCommand
} from "../controllers/command.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/:id/commands", createCommand);

export default router;
