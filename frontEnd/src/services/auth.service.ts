import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
} from "../types/auth.types";

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/register", {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/login", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    return response.data;
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/api/auth/me");
    return response.data;
  },
};

