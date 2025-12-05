// src/pages/VerifyCodePage.tsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { http } from "../api/http";

export default function VerifyCodePage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");
    const fullCode = code.join("");

    if (fullCode.length < 6) {
      setError("Por favor, completa los 6 dígitos.");
      return;
    }

    try {
      setLoading(true);
      await http.post("/verify-code", { email, code: fullCode });
      setMsg("Código verificado correctamente.");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Código inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3E9FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg border border-gray-200 p-8">
        <h1 className="text-center text-lg font-semibold mb-1">
          Ingresa el código que te enviamos por email
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Código de 6 dígitos enviado a: <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="flex gap-2">
            {code.map((c, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={c}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-12 h-12 text-center border-2 border-[#C01717] rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#C01717]"
              />
            ))}
          </div>

          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-60 bg-[#C01717] text-white font-bold rounded-md py-2 mt-2 hover:opacity-90 transition"
          >
            {loading ? "Verificando..." : "Confirmar código"}
          </button>

          <Link to="/login" className="text-xs text-gray-500 mt-2 hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </form>
      </div>
    </div>
  );
}
