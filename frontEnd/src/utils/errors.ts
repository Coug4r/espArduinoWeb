import axios from "axios";

export function getErrorMessage(error: unknown, fallback: string = "Ha ocurrido un error inesperado"): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return String(error.response.data.message);
    }
    if (error.response?.status === 401) {
      return "Sesión expirada o credenciales inválidas";
    }
    if (error.response?.status === 403) {
      return "No tienes permiso para realizar esta acción";
    }
    if (error.response?.status === 404) {
      return "El recurso solicitado no fue encontrado";
    }
    if (error.response?.status === 409) {
      return "Conflicto: El recurso ya existe o el estado ha cambiado";
    }
    if (error.response?.status && error.response.status >= 500) {
      return "Error interno del servidor. Por favor, intenta de nuevo más tarde.";
    }
    if (error.code === "ECONNABORTED" || error.message.includes("Network Error")) {
      return "Error de red: No se pudo conectar con el servidor.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

