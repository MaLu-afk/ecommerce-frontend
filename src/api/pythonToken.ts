// src/api/pythonToken.ts
import { http } from './http';

export interface PythonTokenResponse {
  success: boolean;
  python_token: string;
  expires_in: number; // en segundos
  expires_at: number; // timestamp Unix
  user_id: number;
}

export const pythonTokenService = {

  async requestPythonToken(): Promise<PythonTokenResponse> {
    const response = await http.post<PythonTokenResponse>('/python-token');
    return response.data;
  },

  async refreshPythonToken(): Promise<PythonTokenResponse> {
    const response = await http.post<PythonTokenResponse>('/python-token/refresh');
    return response.data;
  },

  savePythonToken(token: string, expiresAt: number): void {
    localStorage.setItem('python_token', token);
    localStorage.setItem('python_token_expires_at', expiresAt.toString());
  },

  getStoredPythonToken(): string | null {
    return localStorage.getItem('python_token');
  },

  getPythonTokenExpiresAt(): number | null {
    const expiresAt = localStorage.getItem('python_token_expires_at');
    return expiresAt ? parseInt(expiresAt, 10) : null;
  },

  isPythonTokenExpired(): boolean {
    const expiresAt = this.getPythonTokenExpiresAt();
    if (!expiresAt) return true;

    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 60;

    return (expiresAt - now) < bufferTime;
  },

  clearPythonToken(): void {
    localStorage.removeItem('python_token');
    localStorage.removeItem('python_token_expires_at');
  },

  async getValidPythonToken(): Promise<string | null> {
    try {
      const storedToken = this.getStoredPythonToken();

      if (!storedToken || this.isPythonTokenExpired()) {
        const response = await this.refreshPythonToken();
        this.savePythonToken(response.python_token, response.expires_at);
        return response.python_token;
      }

      return storedToken;

    } catch (error) {
      console.error('Error al obtener token de Python:', error);
      return null;
    }
  },
};
