// src/admin/components/shared/AdminLoading.tsx
export function AdminLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '200px',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div className="admin-spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3B001E',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: '#6b7280', margin: 0 }}>Cargando...</p>
    </div>
  );
}

export function TableLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem'
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3B001E',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );
}

export function ModalLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '3rem',
      background: 'white',
      borderRadius: '8px'
    }}>
      <div style={{
        width: '25px',
        height: '25px',
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #3B001E',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <span style={{ marginLeft: '12px', color: '#6b7280' }}>Cargando...</span>
    </div>
  );
}