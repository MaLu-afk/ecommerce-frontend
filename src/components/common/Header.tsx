// src/components/common/Header.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LogIn, UserPlus, Home, ShoppingCart, ShieldCheck } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import UserMenu from './UserMenu'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isAdmin } = useAuth()
  const { itemCount } = useCart()

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = open ? 'hidden' : prev || ''
    return () => { document.body.style.overflow = prev || '' }
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-[var(--nb-bg)] text-[var(--nb-text)] shadow">
      <div className="mx-auto w-full">
        <div className="relative flex h-16 sm:h-[84px] items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 pl-4 sm:pl-10">
            <img src={logo} alt="Nice Buys" className="h-8 w-8 sm:h-16 sm:w-16" />
          </Link>

          {/* Título centrado */}
          <h1
            className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-4xl uppercase tracking-[.18em] leading-none"
            style={{ fontFamily: '"Protest Strike","Inter",sans-serif' }}
          >
            NICE BUYS
          </h1>

          {/* Acciones derechas */}
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {/* Carrito - siempre visible */}
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center rounded-full p-2 bg-white text-slate-900 shadow-sm hover:bg-slate-50"
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {/* Usuario autenticado - Desktop */}
                <div className="hidden sm:block">
                  <UserMenu />
                </div>

                {/* Usuario autenticado - Móvil: botón hamburguesa */}
                <button
                  type="button"
                  className="sm:hidden inline-flex items-center justify-center rounded-full p-2 bg-white text-slate-900 shadow-sm"
                  aria-label="Abrir menú"
                  aria-expanded={open}
                  onClick={() => setOpen(true)}
                >
                  <Menu size={20} />
                </button>
              </>
            ) : (
              <>
                {/* Usuario no autenticado - Desktop */}
                <Link
                  to="/register"
                  className="hidden sm:inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Registrarme
                </Link>
                <Link
                  to="/login"
                  className="hidden sm:inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                >
                  Iniciar Sesión
                </Link>

                {/* Usuario no autenticado - Móvil: botón hamburguesa */}
                <button
                  type="button"
                  className="sm:hidden inline-flex items-center justify-center rounded-full p-2 bg-white text-slate-900 shadow-sm"
                  aria-label="Abrir menú"
                  aria-expanded={open}
                  onClick={() => setOpen(true)}
                >
                  <Menu size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <nav
            className="absolute right-0 top-0 h-full w-72 max-w-[85%] bg-white text-slate-900 shadow-xl p-4 flex flex-col"
            aria-label="Menú móvil"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">Menú</span>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-slate-100"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
                >
                  <Home size={18} /> Inicio
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-purple-50 text-purple-700 font-medium"
                      >
                        <ShieldCheck size={18} /> Panel de Administración
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/cart"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
                    >
                      <ShoppingCart size={18} /> Mi Carrito
                    </Link>
                  </li>
                  <li className="pt-2 mt-2 border-t">
                    <UserMenu />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
                    >
                      <UserPlus size={18} /> Registrarme
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
                    >
                      <LogIn size={18} /> Iniciar Sesión
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-auto border-t pt-3 text-xs text-slate-500">
              © 2025 Nice Buys
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
