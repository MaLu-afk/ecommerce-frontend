//src/components/common/Footer.tsx
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-[var(--nb-bg)] text-[var(--nb-text)] mt-12 border-t border-slate-200"
    >
      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm">
        {/* Columna 1 */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-2">NICE BUYS</h2>
          <p className="text-slate-400">
            Tu tienda de confianza para tecnología y productos de calidad.
          </p>
        </div>

        {/* Columna 2 */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-2">Enlaces Rápidos</h2>
          <ul className="space-y-1.5">
            <li>
              <a href="#" className="inline-block py-1 hover:text-red-500">
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a href="#" className="inline-block py-1 hover:text-red-500">
                Política de Privacidad
              </a>
            </li>
            <li>
              <a href="#" className="inline-block py-1 hover:text-red-500">
                Contacto
              </a>
            </li>
            <li>
              <a href="#" className="inline-block py-1 hover:text-red-500">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-2">Contacto</h2>
          <ul className="space-y-1 text-slate-400">
            <li>
              Email:{" "}
              <a
                href="mailto:info@nicebuys.com"
                className="hover:text-red-500 underline underline-offset-2"
              >
                info@nicebuys.com
              </a>
            </li>
            <li>
              Teléfono:{" "}
              <a
                href="tel:+15551234567"
                className="hover:text-red-500 underline underline-offset-2"
              >
                +1 (555) 123-4567
              </a>
            </li>
            {/* <li>Horario: Lun - Vie 9:00 - 18:00</li> */}
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-center text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-1">
          © 2025 Nice Buys. Hecho con <Heart size={14} className="text-red-500" /> para ti.
        </div>
      </div>
    </footer>
  );
}
