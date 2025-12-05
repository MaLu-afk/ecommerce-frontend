// src/admin/components/dashboard/DashboardHeader.tsx
export default function DashboardHeader() {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h1 style={{ 
        color: '#444649ff', 
        fontFamily: 'Protest Strike', 
        fontSize: '28px',
        marginBottom: '0.5rem'
      }}>
        Panel de Control
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem', fontFamily: 'Poppins' }}>
        Reportes del negocio
      </p>
    </div>
  )
}