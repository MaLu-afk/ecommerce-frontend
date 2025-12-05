// src/admin/components/dashboard/SalesTrends.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendData, TrendPeriod } from '../../types/dashboard';

interface SalesTrendsProps {
  trendData: TrendData[] | undefined;
  trendPeriod: TrendPeriod;
  onPeriodChange: (period: TrendPeriod) => void;
}

export default function SalesTrends({
  trendData,
  trendPeriod,
  onPeriodChange,
}: SalesTrendsProps) {
  const safeData = trendData ?? [];
  const isEmpty = safeData.length === 0;

  return (
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '30px',
        width: '100%',
        minWidth: 0, // 👈 ayuda a que el grid/flex no deje width raro
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            fontFamily: 'Poppins',
            margin: 0,
          }}
        >
          Tendencias de Ventas
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['7', '30', '90'].map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period as TrendPeriod)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: trendPeriod === period ? '#3b82f6' : 'white',
                color: trendPeriod === period ? 'white' : '#374151',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {period} días
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        // Estado vacío
        <div
          style={{
            height: '300px',
            background: '#f9fafb',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '48px', opacity: 0.5 }}>📊</div>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
            No hay datos de tendencias
          </p>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
            Selecciona un período para ver las tendencias de ventas
          </p>
        </div>
      ) : (
        <>
          {/* 👇 Altura fija directamente en ResponsiveContainer */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={safeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                formatter={(value: number | string) => [
                  `${value} ventas`,
                  'Ventas',
                ]}
                labelFormatter={(label: string | number) =>
                  `Fecha: ${label}`
                }
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                activeDot={{ r: 6, fill: '#3b82f6' }}
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Resumen del período */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#374151',
            }}
          >
            <span>Período: {trendPeriod} días</span>
            <span style={{ fontWeight: '500' }}>
              Total:{' '}
              {safeData.reduce((sum, data) => sum + data.sales, 0)} ventas
            </span>
          </div>
        </>
      )}
    </div>
  );
}
