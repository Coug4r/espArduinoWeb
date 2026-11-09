import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";

import {
  createCommand
} from "../controllers/command.controller";

const router = Router();

router.use(authMiddleware);

router.post("/:id/commands", createCommand);

export default router;
