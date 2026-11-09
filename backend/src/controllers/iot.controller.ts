import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const heartBeat = async (req: Request, res: Response) => {
    try {
        const deviceId = req.deviceId;

        if (!deviceId) {
            return res.status(401).json({
                message: "Dispositivo no autenticado"
            });
        }

        const device = await prisma.device.update({
            where: { id: deviceId },
            data: {
                isOnline: true,
                lastSeen: new Date()
            },
            select: {
                id: true,
                name: true,
                lastSeen: true
            }
        });

        return res.status(200).json({
            message: "HeartBeat recibido!"
        })
    }
    catch (error) { 
        console.error("Error en heartbeat:", error);

        return res.status(500).json({
            message: "Error al actualizar dispositivo"
        });
    }
}
