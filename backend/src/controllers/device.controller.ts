import { Request, Response } from "express";
import { randomBytes, createHash } from "node:crypto";
import prisma from "../config/prisma";

//registrar dispositivo

export const createDevice = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
            return res.status(400).json({
                message: "El nombre debe tener entre 2 y 80 caracteres"
            });
        }

        const deviceToken = randomBytes(32).toString("hex");

        const deviceTokenHash = createHash("sha256")
            .update(deviceToken)
            .digest("hex");

        const device = await prisma.device.create({
            data: {
                name: name.trim(),
                deviceTokenHash,
                userId
            },
            select: {
                id: true,
                name: true,
                isOnline: true,
                lastSeen: true,
                createdAt: true
            }
        });

        return res.status(201).json({
            message: "Dispositivo registrado correctamente",
            device,
            deviceToken
        });

    } catch (error) {
        console.error("Error al registrar dispositivo:", error);

        return res.status(500).json({
            message: "Error al registrar dispositivo"
        });
    }
};

export const getDevices = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;


        if (!userId) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const devices = await prisma.device.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                lastSeen: true,
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const result = devices.map((device) => ({
            ...device,
            isOnline: device.lastSeen != null &&
                Date.now() - device.lastSeen.getTime() < 60000
        }));

        return res.status(200).json({
            total: result.length,
            devices: result
        });


    } catch (error) {
        console.error("Error al listar dispositivos:", error);

        return res.status(500).json({
            message: "Error al consultar dispositivos"
        });
    }
};

export const getDeviceById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const device = await prisma.device.findFirst({
            where: {
                id,
                userId
            },
            select: {
                id: true,
                name: true,
                lastSeen: true,
                createdAt: true
            }
        });

        if (!device) {
            return res.status(404).json({
                message: "Dispositivo no encontrado"
            });
        }

        return res.status(200).json({
            device: {
                ...device,
                isOnline: device.lastSeen !== null &&
                    Date.now() - device.lastSeen.getTime() < 60000
            }
        })
    } catch (error) {
        console.error("Error al consultar dispositivo:", error);

        return res.status(500).json({
            message: "Error al consultar dispositivo"
        });
    }
};

export const deleteDevice = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    const device = await prisma.device.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!device) {
      return res.status(404).json({
        message: "Dispositivo no encontrado"
      });
    }

    await prisma.device.delete({
      where: {
        id: device.id
      }
    });

    return res.status(200).json({
      message: "Dispositivo eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar dispositivo:", error);

    return res.status(500).json({
      message: "Error al eliminar dispositivo"
    });
  }
};