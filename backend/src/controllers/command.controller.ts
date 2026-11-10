import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { getNextCommand } from "../services/command.service.js";

// CREAR COMANDO DESDE EL FRONTEND
export const createCommand = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { commands } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    // Validar propiedad del dispositivo
    const device = await prisma.device.findFirst({
      where: {
        id,
        userId
      },
      select: {
        id: true
      }
    });

    if (!device) {
      return res.status(404).json({
        message: "Dispositivo no encontrado"
      });
    }

    // Validar estructura del comando
    if (
      !commands ||
      typeof commands !== "object" ||
      Array.isArray(commands) ||
      Object.keys(commands).length !== 1 ||
      typeof commands.command !== "string"
    ) {
      return res.status(400).json({
        message: "Formato de comando inválido",
        expected: {
          commands: {
            command: "TU_COMANDO"
          }
        }
      });
    }

    // Validar contenido del comando
    const commandText = commands.command.trim();

    if (
      commandText.length === 0 ||
      commandText.length > 200 ||
      /[\r\n]/.test(commandText)
    ) {
      return res.status(400).json({
        message:
          "El comando debe tener entre 1 y 200 caracteres y no contener saltos de línea"
      });
    }

    // Registrar comando
    const command = await prisma.command.create({
      data: {
        deviceId: device.id,
        payload: {
          commands: {
            command: commandText
          }
        },
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      },
      select: {
        id: true,
        payload: true,
        status: true,
        createdAt: true,
        expiresAt: true
      }
    });

    return res.status(201).json({
      message: "Comando registrado correctamente",
      command
    });

  } catch (error) {
    console.error("Error al crear comando:", error);

    return res.status(500).json({
      message: "Error al registrar comando"
    });
  }
};


// OBTENER SIGUIENTE COMANDO (ESP8266)
export const nextCommand = async (
  req: Request,
  res: Response
) => {
  try {
    const deviceId = req.deviceId;

    if (!deviceId) {
      return res.status(401).json({
        message: "Dispositivo no autenticado"
      });
    }

    // Marcar comandos vencidos
    await prisma.command.updateMany({
      where: {
        deviceId,
        status: {
          in: ["PENDING", "DELIVERED"]
        },
        expiresAt: {
          lte: new Date()
        }
      },
      data: {
        status: "EXPIRED",
        leaseUntil: null
      }
    });

    const command = await getNextCommand(deviceId);

    if (!command) {
      return res.status(200).json({
        commands: {}
      });
    }

    const payload = command.payload as {
      commands: Record<string, string>;
    };

    return res.status(200).json({
      commandId: command.id,
      commands: payload.commands,
      expiresAt: command.expiresAt,
      deliveryAttempts: command.deliveryAttempts
    });

  } catch (error) {
    console.error("Error al consultar comandos:", error);

    return res.status(500).json({
      message: "Error al consultar comandos"
    });
  }
};


// CONFIRMAR EJECUCIÓN (ESP8266)
export const ackCommand = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const deviceId = req.deviceId;
    const { id } = req.params;
    const { status, details } = req.body;

    if (!deviceId) {
      return res.status(401).json({
        message: "Dispositivo no autenticado"
      });
    }

    // Validar estado y permitir que TypeScript infiera el enum
    if (status !== "EXECUTED" && status !== "FAILED") {
      return res.status(400).json({
        message: "Estado de confirmación inválido"
      });
    }

    if (
      details !== undefined &&
      (
        typeof details !== "string" ||
        details.length > 500
      )
    ) {
      return res.status(400).json({
        message: "Detalles inválidos"
      });
    }

    const command = await prisma.command.findFirst({
      where: {
        id,
        deviceId
      }
    });

    if (!command) {
      return res.status(404).json({
        message: "Comando no encontrado"
      });
    }

    if (
      command.status === "EXECUTED" ||
      command.status === "FAILED"
    ) {
      return res.status(200).json({
        message: "El comando ya fue procesado",
        status: command.status
      });
    }

    if (command.status === "EXPIRED") {
      return res.status(410).json({
        message: "El comando ha vencido"
      });
    }

    if (command.expiresAt <= new Date()) {
      await prisma.command.updateMany({
        where: {
          id,
          deviceId,
          status: {
            in: ["PENDING", "DELIVERED"]
          }
        },
        data: {
          status: "EXPIRED",
          leaseUntil: null
        }
      });

      return res.status(410).json({
        message: "El comando ha vencido"
      });
    }

    // Actualización condicional
    const result = await prisma.command.updateMany({
      where: {
        id,
        deviceId,
        status: "DELIVERED",
        expiresAt: {
          gt: new Date()
        }
      },
      data: {
        status,
        executedAt: new Date(),
        leaseUntil: null
      }
    });

    if (result.count !== 1) {
      return res.status(409).json({
        message: "El comando ya no está disponible para confirmar"
      });
    }

    // Registrar resultado
    await prisma.deviceLog.create({
      data: {
        deviceId,
        event: status,
        details: {
          commandId: id,
          description: details ?? null
        }
      }
    });

    return res.status(200).json({
      message: "Confirmación recibida",
      commandId: id,
      status
    });

  } catch (error) {
    console.error("Error al confirmar comando:", error);

    return res.status(500).json({
      message: "Error al confirmar comando"
    });
  }
};
