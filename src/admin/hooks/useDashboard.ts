// src/admin/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { useNotificationContext } from '../context/NotificationContext';
import { dashboardService } from '../services/dashboardService';
import type {
  DashboardStats,
  TopProduct,
  TopSearchedProduct,
  TopCategory,
  InventoryAlert,
  TrendData,
  TrendPeriod
} from '../types/dashboard';

export const useDashboard = () => {
  // Estado inicial completo para evitar errores de TypeScript
  const [stats, setStats] = useState<DashboardStats>({
    monthlyRevenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
    monthlySales: 0,
    monthlyRevenueGrowth: 0,
    monthlySalesGrowth: 0,
    completedOrders: 0
  });
  
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topSearchedProducts, setTopSearchedProducts] = useState<TopSearchedProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('30');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadTrendData(trendPeriod);
  }, [trendPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      
      setStats(data.stats);
      setTopProducts(data.topProducts);
      setTopSearchedProducts(data.topSearchedProducts);
      setTopCategories(data.topCategories);
      setInventoryAlerts(data.inventoryAlerts);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addNotification('error', 'Error', 'No se pudieron cargar las estadísticas del dashboard');
      setLoading(false);
    }
  };

  const loadTrendData = async (period: TrendPeriod) => {
    try {
      const data = await dashboardService.getTrendData(period);
      setTrendData(data || []); 
    } catch (error) {
      console.error('Error loading trend data:', error);
      addNotification('error', 'Error', 'No se pudieron cargar las tendencias de ventas');
      setTrendData([]); 
    }
  };

  const handleRestock = async (productId: number) => {
    try {
      await dashboardService.restockProduct(productId, 50);
      addNotification('success', 'Éxito', 'Stock actualizado correctamente');
      // Recargar las alertas de inventario
      const alerts = await dashboardService.getInventoryAlerts();
      setInventoryAlerts(alerts);
    } catch (error) {
      console.error('Error restocking product:', error);
      addNotification('error', 'Error', 'No se pudo actualizar el stock');
    }
  };

  return {
    stats,
    topProducts,
    topSearchedProducts,
    topCategories,
    inventoryAlerts,
    trendPeriod,
    trendData,
    loading,
    setTrendPeriod,
    handleRestock
  };
};