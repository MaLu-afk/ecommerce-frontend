// src/admin/services/dashboardService.ts
import { http } from '../../api/http';
import type {
  DashboardStats,
  TrendData,
  InventoryAlert,
  TrendPeriod
} from '../types/dashboard';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardStats> {
    const response = await http.get('/admin/dashboard');
    return response.data;
  },

  async getTrendData(period: TrendPeriod): Promise<TrendData[]> {
    const response = await http.get(`/admin/dashboard/trends?period=${period}`);
    return response.data;
  },

  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    const response = await http.get('/admin/dashboard/inventory-alerts');
    return response.data;
  },

  async restockProduct(productId: number, quantity: number): Promise<void> {
    await http.patch(`/admin/products/${productId}/stock`, { stock: quantity });
  }
};