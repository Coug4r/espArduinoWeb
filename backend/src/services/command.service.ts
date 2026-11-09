
import { Prisma } from "../generated/prisma/client";
import prisma from "../config/prisma";

const LEASE_SECONDS = 30;

export const getNextCommand = async (deviceId: string) => {
  return prisma.$transaction(async (tx) => {

    const now = new Date();

    // Buscar comandos pendientes o entregados
    // cuyo tiempo de reserva ya haya vencido.
    const command = await tx.command.findFirst({
      where: {
        deviceId,
        expiresAt: {
          gt: now
        },
        OR: [
          {
            status: "PENDING"
          },
          {
            status: "DELIVERED",
            leaseUntil: {
              lte: now
            }
          }
        ]
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!command) {
      return null;
    }

    // Actualización condicional para evitar
    // que dos consultas reclamen el mismo comando.
    const claimed = await tx.command.updateMany({
      where: {
        id: command.id,
        OR: [
          {
            status: "PENDING"
          },
          {
            status: "DELIVERED",
            leaseUntil: {
              lte: now
            }
          }
        ]
      },
      data: {
        status: "DELIVERED",
        deliveredAt: now,
        leaseUntil: new Date(
          now.getTime() + LEASE_SECONDS * 1000
        ),
        deliveryAttempts: {
          increment: 1
        }
      }
    });

    if (claimed.count !== 1) {
      return null;
    }

    return tx.command.findUnique({
      where: {
        id: command.id
      },
      select: {
        id: true,
        payload: true,
        status: true,
        expiresAt: true,
        deliveryAttempts: true
      }
    });
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable
  });
};