-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "deliveryAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "leaseUntil" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Command_deviceId_status_leaseUntil_idx" ON "Command"("deviceId", "status", "leaseUntil");
