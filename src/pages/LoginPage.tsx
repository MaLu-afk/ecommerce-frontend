// src/pages/LoginPage.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import poster from "../assets/Rectangle 59.png";
import GoogleLoginButton from "./GoogleLoginButton";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const nav = useNavigate();
  const loc = useLocation();
  const { setSession } = useAuth();

  const redirectAfterLogin = (user: { rol: string }) => {
    const from = (loc.state as { from?: string })?.from;

    if (user.rol === "admin") {
      if (from) return nav(from, { replace: true });
      return nav("/admin", { replace: true });
    }

    // Si es cliente, evitar redirigir a rutas de admin
    if (from && !from.startsWith("/admin")) {
      return nav(from, { replace: true });
    }

    return nav("/", { replace: true });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("Ingresa un correo válido.");
      return;
    }
    if (pass.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await login(email, pass, remember);
      setSession(token, user);
      redirectAfterLogin(user);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.response?.data?.errors?.email?.[0] ??
        "No se pudo iniciar sesión.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3E9FF] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-[#F3F3F3] rounded-[30px] overflow-hidden shadow-lg w-full max-w-[700px] min-h-[480px]">
        {/* FORMULARIO */}
        <section className="w-full md:w-[50%] p-5 flex flex-col justify-center border-l-[3px] border-[#7A4E4F]">
          <div className="max-w-[340px] mx-auto w-full">
            <h1 className="text-[19px] font-extrabold text-gray-900">
              ¡Bienvenido de nuevo!
            </h1>
            <p className="mt-0.5 text-[12px] text-gray-600">
              Inicia sesión en tu cuenta para continuar
            </p>

            <form onSubmit={onSubmit} className="mt-3 space-y-2">
              {/* CORREO ELECTRÓNICO */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full border border-black rounded-[12px] px-3 py-1.5 text-[13px] outline-none focus:ring-2 focus:ring-[#C84635]"
                />
              </div>

              {/* CONTRASEÑA */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-gray-700">
                    Contraseña
                  </label>
                  {/* 🔹 Link actualizado */}
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#C84635] hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-black rounded-[12px] px-3 py-1.5 pr-10 text-[13px] outline-none focus:ring-2 focus:ring-[#C84635]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* RECORDARME */}
              <label className="inline-flex items-center gap-2 text-[11px] text-gray-600 pt-0.5">
                <input
                  type="checkbox"
                  className="size-4 rounded border-gray-300"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Recordarme
              </label>

              {/* ERROR */}
              {err && (
                <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1">
                  {err}
                </p>
              )}

              {/* BOTÓN INICIAR SESIÓN */}
              <button
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-[12px] text-sm font-semibold shadow-md hover:bg-gray-900 transition-all disabled:opacity-50"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              {/* DIVISOR */}
              <div className="flex items-center gap-2 py-0.5">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-[11px] text-gray-500">O continuar con</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/* BOTÓN GOOGLE */}
              <GoogleLoginButton />

              {/* FOOTER */}
              <p className="text-center text-[11px] text-gray-600 pt-0.5">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-[#C84635] hover:underline font-semibold"
                >
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* IMAGEN + TEXTO "NICE BUYS" */}
        <div className="relative w-full md:w-[50%] min-h-[320px]">
          <img src={poster} alt="NICE BUYS" className="w-full h-full object-cover" />

          <h2
            className="absolute text-center pointer-events-none"
            style={{
              fontFamily: "'Holtwood One SC', serif",
              letterSpacing: "7px",
              textShadow: "2px 2px 6px rgba(0,0,0,0.25)",
              top: "47%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(2.8rem, 8vw, 5rem)",
              lineHeight: "1.1",
            }}
          >
            <span style={{ color: "#C84635", WebkitTextStroke: "3px #FFFFFF" }}>N</span>
            <span style={{ color: "#FFFFFF", WebkitTextStroke: "3px #FFFFFF" }}>I</span>
            <span style={{ color: "#C84635", WebkitTextStroke: "3px #FFFFFF" }}>C</span>
            <span style={{ color: "#FFFFFF", WebkitTextStroke: "3px #FFFFFF" }}>E</span>
            <br />
            <span style={{ color: "#C84635", WebkitTextStroke: "3px #FFFFFF" }}>B</span>
            <span style={{ color: "#FFFFFF", WebkitTextStroke: "3px #FFFFFF" }}>U</span>
            <span style={{ color: "#C84635", WebkitTextStroke: "3px #FFFFFF" }}>Y</span>
            <span style={{ color: "#FFFFFF", WebkitTextStroke: "3px #FFFFFF" }}>S</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
