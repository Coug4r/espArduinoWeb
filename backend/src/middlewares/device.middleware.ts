import { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";
import prisma from "../config/prisma.js";

export const deviceMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token del dispositivo requerido"
            });
        }

        const token = authorization.slice(7).trim();

        if (!/^[a-f0-9]{64}$/i.test(token)) {
            return res.status(401).json({
                message: "Token del dispositivo inválido"
            });
        }

        const tokenHash = createHash("sha256")
            .update(token)
            .digest("hex");

        const device = await prisma.device.findUnique({
            where: {
                deviceTokenHash: tokenHash
            },
            select: {
                id: true
            }
        });

        if (!device) {
            return res.status(401).json({
                message: "Dispositivo no autorizado!"
            });
        }

        req.deviceId = device.id

        next();

    } catch (error) {
        console.error("Error en deviceMiddleware:", error);

        return res.status(500).json({
            message: "Error al autenticar dispositivo"
        });
    }
}