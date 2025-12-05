// src/admin/types/dashboard.ts
export interface DashboardStats {
  monthlyRevenue: number;
  pendingOrders: number;
  activeProducts: number;
  monthlySales: number;
  monthlyRevenueGrowth: number; 
  monthlySalesGrowth: number; 
  completedOrders: number;     
}

export interface TopCategory {
  id: number;
  name: string;
  searches: number;
  stock: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  category: string;
  stock: number;
}

export interface TopSearchedProduct {
  id: number;
  name: string;
  searches: number;
}

export interface InventoryAlert {
  id: number;
  name: string;
  stock: number;
  status: 'critical' | 'low';
}

export interface TrendData {
  date: string;
  sales: number;
}

export type TrendPeriod = '7' | '30' | '90';