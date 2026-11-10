import api from "./api";
import type {
  CreateCommandResponse,
  LedCommandValue,
} from "../types/command.types";

export const commandsService = {
  /**
   * Envía cualquier comando en formato texto al dispositivo a través del backend
   * Endpoint: POST /api/devices/:id/commands
   * Body: { commands: { command: "TU_COMANDO" } }
   */
  async sendCommand(
    deviceId: string,
    commandText: string
  ): Promise<CreateCommandResponse> {
    const cleanCommand = commandText.trim();
    const response = await api.post<CreateCommandResponse>(
      `/api/devices/${deviceId}/commands`,
      {
        commands: {
          command: cleanCommand,
        },
      }
    );
    return response.data;
  },

  /**
   * Envía un comando de LED al dispositivo respetando el nuevo contrato del backend
   * Body: { commands: { command: "LED_ON" | "LED_OFF" } }
   */
  async sendLedCommand(
    deviceId: string,
    ledState: LedCommandValue
  ): Promise<CreateCommandResponse> {
    return this.sendCommand(deviceId, ledState);
  },
};
