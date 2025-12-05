// src/pages/ForgotPasswordPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/http";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      setLoading(true);
      await http.post("/forgot-password", { email });
      setMsg("Te enviamos un código de verificación a tu correo.");
      setTimeout(() => navigate("/verify-code", { state: { email } }), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "No se pudo enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3E9FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Ingresa tu correo y te enviaremos un código de verificación.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C84635] outline-none"
            required
          />

          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-all"
          >
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link to="/login" className="text-[#C84635] hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
