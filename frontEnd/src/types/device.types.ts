export interface Device {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
}

export interface CreateDeviceDto {
  name: string;
}

export interface CreateDeviceResponse {
  message: string;
  device: Device;
  deviceToken: string;
}

export interface GetDevicesResponse {
  total: number;
  devices: Device[];
}

export interface GetDeviceByIdResponse {
  device: Device;
}

export interface DeleteDeviceResponse {
  message: string;
}

