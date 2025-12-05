// src/admin/components/shared/AdminNavigation.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../styles/AdminNavigation.css'

interface NavigationItem {
  id: string
  label: string
  path: string
  enabled: boolean
}

const AdminNavigation: React.FC = () => {
  const location = useLocation()

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', enabled: true },
    { id: 'products', label: 'Productos', path: '/admin/productos', enabled: true },
    { id: 'categories', label: 'Categorías', path: '/admin/categorias', enabled: true },
    { id: 'pedido', label: 'Pedido', path: '/admin/pedidos', enabled: true },
    { id: 'banners', label: 'Banners', path: '/admin/banners', enabled: false },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="admin-navigation">
      <div className="nav-tabs">
        {navigationItems.map((item) => (
          item.enabled ? (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-tab ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ) : (
            <div
              key={item.id}
              className="nav-tab disabled"
              title="Funcionalidad próximamente disponible"
            >
              {item.label}
            </div>
          )
        ))}
      </div>
    </nav>
  )
}

export default AdminNavigation