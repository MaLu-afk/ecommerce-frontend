// src/router/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from '../hooks/useAuth';

type Role = 'admin' | 'cliente';

export default function ProtectedRoute({
  children,
  roles,
}: { children: ReactElement; roles?: Role[] }) {
  const loc = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mostrar loading mientras verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  // Verificar roles si se especificaron
  if (roles && (!user || !roles.includes(user.rol))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
