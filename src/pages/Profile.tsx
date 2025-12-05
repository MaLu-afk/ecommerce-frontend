import React, { useState } from 'react';
import UserProfile from '../components/profile/UserProfile';
import { UserRecommendations } from '../components/recommendations/UserRecommendations';
import type { User } from '../types/profile';
import { useAuth } from '../hooks/useAuth';
import { http } from "../api/http";

function App() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      console.log('Usuario actualizado:', updatedUser);
      setLoading(true); // Activa el overlay mientras se guarda

      const response = await http.put(`/updateUser/${updatedUser.id}`, {
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        phone: updatedUser.phone,
        image: updatedUser.image,
        address: updatedUser.address,   // <-- AHORA SÍ ENVÍA LO CORRECTO
      });


      console.log("Respuesta del servidor:", response.data);

      // Esperar un poco antes de refrescar vista (opcional)
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error("Error actualizando usuario:", error);
    } finally {
      setLoading(false); // Quita el overlay
    }
  };

  if (!user) return <p>Cargando datos del usuario...</p>;

  return (
    <div className="App">
      {loading && (
        <div style={overlayStyles}>
          <div style={spinnerStyles}></div>
          <p style={{ color: "#fff", marginTop: "12px" }}>Actualizando...</p>
        </div>
      )}

      <UserProfile user={user} onUpdateUser={handleUpdateUser} />

      {/* Recomendaciones personalizadas basadas en historial */}
      <div className="container mx-auto px-4 pb-8">
        <UserRecommendations
          title="Productos que podrían interesarte"
          topN={6}
        />
      </div>
    </div>
  );
}

export default App;

// 🎨 Estilos del overlay y spinner
const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const spinnerStyles: React.CSSProperties = {
  width: "50px",
  height: "50px",
  border: "6px solid #fff",
  borderTop: "6px solid transparent",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite"
};

