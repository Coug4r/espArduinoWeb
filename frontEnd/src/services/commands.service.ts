import api from "./api";
import type {
  CreateCommandResponse,
  LedCommandValue,
} from "../types/command.types";

export const commandsService = {
  /**
   * Envía un comando de LED al dispositivo a través del backend
   * Endpoint: POST /api/devices/:id/commands
   * Body: { commands: { led: "LED_ON" | "LED_OFF" } }
   */
  async sendLedCommand(
    deviceId: string,
    ledState: LedCommandValue
  ): Promise<CreateCommandResponse> {
    const response = await api.post<CreateCommandResponse>(
      `/api/devices/${deviceId}/commands`,
      {
        commands: {
          led: ledState,
        },
      }
    );
    return response.data;
  },
};

