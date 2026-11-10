export type CommandStatus = "PENDING" | "DELIVERED" | "EXECUTED" | "FAILED" | "EXPIRED";

export type LedCommandValue = "LED_ON" | "LED_OFF";

export interface CommandPayload {
  commands: {
    command?: string;
    led?: string;
    [key: string]: string | undefined;
  };
}

export interface Command {
  id: string;
  payload: CommandPayload;
  status: CommandStatus;
  createdAt: string;
  expiresAt: string;
  deliveredAt?: string | null;
  executedAt?: string | null;
  deliveryAttempts?: number;
}

export interface CreateCommandDto {
  commands: {
    command: string;
  };
}

export interface CreateCommandResponse {
  message: string;
  command: Command;
  expected?: {
    commands: {
      command: string;
    };
  };
}
