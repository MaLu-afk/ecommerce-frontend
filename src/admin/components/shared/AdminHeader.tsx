// src/admin/components/shared/AdminHeader.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Home } from 'lucide-react'
import logo from '@/assets/logo.svg'
import UserMenu from "./UserMenu"

export default function AdminHeader() {
  const [open, setOpen] = useState(false)

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
          <div className="flex items-center gap-3 pl-4 sm:pl-10">
            <img src={logo} alt="Nice Buys" className="h-8 w-8 sm:h-16 sm:w-16" />
          </div>


          {/* Título centrado */}
          <h1
            className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-4xl uppercase tracking-[.18em] leading-none"
            style={{ fontFamily: '"Protest Strike","Inter",sans-serif' }}
          >
            NICE BUYS - ADMINISTRADOR
          </h1>

          {/* Acciones derechas */}
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {/* Desktop - UserMenu del ADMIN */}
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            {/* Móvil: botón hamburguesa */}
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center rounded-full p-2 bg-white text-slate-900 shadow-sm"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
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
              <span className="font-semibold">Menú Admin</span>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-slate-100"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* UserMenu del ADMIN en móvil */}
            <div className="mt-4">
              <UserMenu />
            </div>

            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100"
                >
                  <Home size={18} /> Dashboard
                </Link>
              </li>
            </ul>

            <div className="mt-auto border-t pt-3 text-xs text-slate-500">
              © 2025 Nice Buys Admin
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}