// src/admin/components/dashboard/StatsGrid.tsx
import type { DashboardStats } from '../../types/dashboard';

interface StatsGridProps {
  stats: DashboardStats;
  inventoryAlertsCount: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value}%`;
};

const getGrowthColor = (value: number) => {
  return value >= 0 ? '#10b981' : '#ef4444';
};

export default function StatsGrid({ stats, inventoryAlertsCount }: StatsGridProps) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {/* Ingresos del Mes */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontFamily: 'Poppins' }}>
          INGRESOS DEL MES
        </p>
        <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          {formatCurrency(stats.monthlyRevenue)}
        </h3>
        <p style={{ 
          color: getGrowthColor(stats.monthlyRevenueGrowth), 
          fontSize: '14px', 
          margin: 0, 
          fontWeight: '500' 
        }}>
          {formatPercentage(stats.monthlyRevenueGrowth)} vs mes anterior
        </p>
      </div>

      {/* Pedidos Pendientes */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontFamily: 'Poppins' }}>
          PEDIDOS PENDIENTES
        </p>
        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          {stats.pendingOrders}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          {stats.completedOrders} completados este mes
        </p>
      </div>

      {/* Productos Activos */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontFamily: 'Poppins' }}>
          PRODUCTOS ACTIVOS
        </p>
        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          {stats.activeProducts}
        </h3>
        <p style={{ 
          color: inventoryAlertsCount > 0 ? '#ef4444' : '#10b981', 
          fontSize: '14px', 
          margin: 0 
        }}>
          {inventoryAlertsCount} con stock bajo
        </p>
      </div>

      {/* Ventas del Mes */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px', fontFamily: 'Poppins' }}>
          VENTAS DEL MES
        </p>
        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
          {stats.monthlySales}
        </h3>
        <p style={{ 
          color: getGrowthColor(stats.monthlySalesGrowth), 
          fontSize: '14px', 
          margin: 0, 
          fontWeight: '500' 
        }}>
          {formatPercentage(stats.monthlySalesGrowth)} vs mes anterior
        </p>
      </div>
    </div>
  );
}