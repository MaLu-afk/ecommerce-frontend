// src/admin/components/shared/UserMenu.tsx
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutPanelTop , ScanEye } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import Avatar from '../../../components/common/Avatar';
import '../../styles/UserMenu.css';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const userName = `${user.nombre} ${user.apellido}`;
  const userRole = user.rol === 'admin' ? 'Administrador' : 'Cliente';

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="user-menu-button flex items-center gap-3 rounded-lg px-4 py-3 text-white transition"
      >
        {/* Texto */}
        <div className="text-left hidden sm:block">
          <div className="user-menu-role text-sm">{userRole}</div>
          <div className="user-menu-name font-semibold">{userName}</div>
        </div>

        {/* Avatar */}
        <Avatar name={userName} size="md" />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay para cerrar al hacer click afuera */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg border border-gray-200 z-50">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <Avatar name={userName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            
            <ul className="py-2 text-sm text-slate-700">
              {/* OPCIONES ESPECÍFICAS DEL ADMIN */}

              <li>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LayoutPanelTop size={18} className="text-purple-600" />
                  <span>Panel de Administración</span>
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/vista-previa"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <ScanEye size={18} className="text-green-700" />
                  <span>Vista Previa</span>
                </Link>                
              </li>
              
              <li className="border-t border-gray-100 mt-2 pt-2">
                <button
                  className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}