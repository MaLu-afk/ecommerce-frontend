// src/admin/components/dashboard/Dashboard.tsx
import { useDashboard } from '../../hooks/useDashboard';
import DashboardHeader from './DashboardHeader';
import StatsGrid from './StatsGrid';
import ProductsSection from './ProductsSection';
import CategoriesSection from './CategoriesSection';
import InventoryAlerts from './InventoryAlerts';
import SalesTrends from './SalesTrends';
import LoadingState from './LoadingState';

export default function Dashboard() {
  const {
    stats,
    topProducts,
    topSearchedProducts,
    topCategories,
    inventoryAlerts,
    trendPeriod,
    trendData,
    loading,
    setTrendPeriod,
    handleRestock,
  } = useDashboard();

  if (loading) {
    return <LoadingState />;
  }

  // ✅ Siempre usar arrays seguros (evitar undefined)
  const safeTopProducts = topProducts ?? [];
  const safeTopSearchedProducts = topSearchedProducts ?? [];
  const safeTopCategories = topCategories ?? [];
  const safeInventoryAlerts = inventoryAlerts ?? [];
  const safeTrendData = trendData ?? [];

  return (
    <div
      style={{
        maxWidth: '1250px',
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
      }}
    >
      <DashboardHeader />

      <StatsGrid
        stats={stats}
        inventoryAlertsCount={safeInventoryAlerts.length}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <ProductsSection
          topProducts={safeTopProducts}
          topSearchedProducts={safeTopSearchedProducts}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <CategoriesSection topCategories={safeTopCategories} />
        <InventoryAlerts
          inventoryAlerts={safeInventoryAlerts}
          onRestock={handleRestock}
        />
      </div>

      <SalesTrends
        trendData={safeTrendData}
        trendPeriod={trendPeriod}
        onPeriodChange={setTrendPeriod}
      />
    </div>
  );
}
