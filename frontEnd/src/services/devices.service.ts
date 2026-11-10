import api from "./api";
import type {
  CreateDeviceDto,
  CreateDeviceResponse,
  DeleteDeviceResponse,
  GetDeviceByIdResponse,
  GetDevicesResponse,
} from "../types/device.types";

export const devicesService = {
  async getDevices(): Promise<GetDevicesResponse> {
    const response = await api.get<GetDevicesResponse>("/api/devices");
    return response.data;
  },

  async getDeviceById(id: string): Promise<GetDeviceByIdResponse> {
    const response = await api.get<GetDeviceByIdResponse>(`/api/devices/${id}`);
    return response.data;
  },

  async createDevice(dto: CreateDeviceDto): Promise<CreateDeviceResponse> {
    const response = await api.post<CreateDeviceResponse>("/api/devices", {
      name: dto.name.trim(),
    });
    return response.data;
  },

  async deleteDevice(id: string): Promise<DeleteDeviceResponse> {
    const response = await api.delete<DeleteDeviceResponse>(`/api/devices/${id}`);
    return response.data;
  },
};

