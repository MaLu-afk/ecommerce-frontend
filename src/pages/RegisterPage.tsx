// src/pages/RegisterPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { http } from "../api/http";
import { useAuth } from "../hooks/useAuth";
import poster from "../assets/Rectangle 59.png";
import GoogleLoginButton from "./GoogleLoginButton"; // botón de Google

// 🔹 NUEVO: tipo + función para evaluar fuerza de contraseña
type PasswordStrengthInfo = {
  score: number;
  label: string;
  textClass: string;
  barClass: string;
  percent: number;
};

function getPasswordStrengthInfo(password: string): PasswordStrengthInfo {
  if (!password) {
    return {
      score: 0,
      label: "",
      textClass: "",
      barClass: "",
      percent: 0,
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // score va de 0 a 5
  const percent = Math.min((score / 5) * 100, 100);

  let label = "";
  let textClass = "";
  let barClass = "";

  if (score <= 2) {
    label = "Contraseña débil";
    textClass = "text-red-600";
    barClass = "bg-red-500";
  } else if (score === 3 || score === 4) {
    label = "Contraseña aceptable";
    textClass = "text-yellow-600";
    barClass = "bg-yellow-400";
  } else {
    label = "Contraseña segura";
    textClass = "text-green-600";
    barClass = "bg-green-500";
  }

  return { score, label, textClass, barClass, percent };
}

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Modal de dirección
  const [showModal, setShowModal] = useState(false);
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [contacto, setContacto] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!nombre.trim()) return setError("El nombre es requerido"), false;
    if (!apellido.trim()) return setError("El apellido es requerido"), false;
    if (!email.trim()) return setError("El correo electrónico es requerido"), false;
    if (!telefono.trim()) return setError("El número de teléfono es requerido"), false;
    if (!direccion.trim()) return setError("La dirección es requerida"), false;
    if (password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres"), false;

    // 🔹 NUEVO: no permitir contraseñas muy débiles
    const strength = getPasswordStrengthInfo(password);
    if (strength.score <= 2) {
      return (
        setError(
          "La contraseña es muy débil. Usa mayúsculas, minúsculas, números y un carácter especial."
        ),
        false
      );
    }

    if (password !== confirmPassword)
      return setError("Las contraseñas no coinciden"), false;
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await http.post("/register", {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        departamento,
        provincia,
        distrito,
        contacto,
        password,
        password_confirmation: confirmPassword,
      });

      const { token, user } = response.data;

      if (token && user) {
        login(token, user);
        setSuccess(true);
        setTimeout(() => navigate("/", { replace: true }), 1500);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error en el registro.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cuando se confirma el modal, se arma una dirección y se llena el campo
  const handleConfirmarDireccion = () => {
    const direccionCompleta = `${contacto ? contacto + " - " : ""}${direccion ? direccion + ", " : ""}${distrito ? distrito + ", " : ""}${provincia ? provincia + ", " : ""}${departamento}`;
    setDireccion(direccionCompleta.trim());
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#E3E9FF] flex items-center justify-center p-4 relative">
      <div className="flex flex-col md:flex-row bg-[#F3F3F3] rounded-[30px] overflow-hidden shadow-lg w-full max-w-[850px] min-h-[580px]">
        {/* FORMULARIO */}
        <section className="w-full md:w-[50%] p-7 flex flex-col justify-center border-l-[3px] border-[#7A4E4F]">
          <div className="max-w-[400px] mx-auto w-full">
            <h1 className="text-[21px] font-extrabold text-gray-900">
              ¡Únete a nosotros!
            </h1>
            <p className="mt-1 text-[13px] text-gray-600">
              Crea tu cuenta y descubre las mejores ofertas
            </p>

            {success && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                ¡Registro exitoso! Redirigiendo...
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-4 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Nombre" value={nombre} setValue={setNombre} placeholder="Juan" />
                <Input label="Apellido" value={apellido} setValue={setApellido} placeholder="Pérez" />
              </div>

              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                setValue={setEmail}
                placeholder="tucorreo@ejemplo.com"
              />

              <Input
                label="Número de teléfono"
                type="tel"
                value={telefono}
                setValue={setTelefono}
                placeholder="999 999 999"
              />

              {/* CAMPO DE DIRECCIÓN - ABRE MODAL */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccion}
                  onClick={() => setShowModal(true)}
                  readOnly
                  placeholder="Av. Los Olivos 123"
                  className="w-full border border-black rounded-[12px] px-3 py-2 text-[13px] outline-none cursor-pointer bg-white hover:bg-gray-50 focus:ring-2 focus:ring-[#C84635]"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Haz clic para ingresar tu dirección completa
                </p>
              </div>

              <PasswordInput
                label="Contraseña"
                value={password}
                setValue={setPassword}
                show={showPassword}
                setShow={setShowPassword}
              />

              {/* 🔹 NUEVO: indicador visual de fuerza */}
              <PasswordStrengthIndicator password={password} />

              <PasswordInput
                label="Confirmar contraseña"
                value={confirmPassword}
                setValue={setConfirmPassword}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
              />

              {error && (
                <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
                  {error}
                </p>
              )}

              <button
                disabled={loading || success}
                className="w-full bg-black text-white py-2.5 rounded-[12px] text-sm font-semibold shadow-md hover:bg-gray-900 transition-all"
              >
                {loading ? "Registrando..." : success ? "✓ Registrado" : "Crear mi cuenta"}
              </button>

              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-[11px] text-gray-500">O continuar con</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              <GoogleLoginButton />

              <p className="text-center text-[11px] text-gray-600 pt-1">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="text-[#C84635] hover:underline font-semibold"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* IMAGEN + TEXTO */}
        <div className="relative w-full md:w-[50%] min-h-[380px]">
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
              fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
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

      {/* 🧩 MODAL DE DIRECCIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative border border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-extrabold text-gray-900 text-center mb-4">
              Ingresar dirección
            </h2>

            <div className="space-y-3">
              <Input label="Dirección" value={direccion} setValue={setDireccion} placeholder="Av. Los Olivos 123" />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label="Departamento" value={departamento} setValue={setDepartamento} placeholder="Lima" />
                <Input label="Provincia" value={provincia} setValue={setProvincia} placeholder="Lima" />
              </div>
              <Input label="Distrito" value={distrito} setValue={setDistrito} placeholder="Los Olivos" />
              <Input label="Datos de contacto" value={contacto} setValue={setContacto} placeholder="Referencia, piso, etc." />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarDireccion}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-[#C01717] text-white hover:bg-[#a11414] transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTES AUXILIARES */
function Input({ label, type = "text", value, setValue, placeholder }: any) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-black rounded-[12px] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#C84635]"
      />
    </div>
  );
}

function PasswordInput({ label, value, setValue, show, setShow }: any) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-black rounded-[12px] px-3 py-2 pr-10 text-[13px] outline-none focus:ring-2 focus:ring-[#C84635]"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

// 🔹 NUEVO: componente visual para la fuerza
function PasswordStrengthIndicator({ password }: { password: string }) {
  const { label, textClass, barClass, percent } = getPasswordStrengthInfo(password);

  if (!password || !label) return null;

  return (
    <div className="mt-1">
      <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full transition-all ${barClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className={`mt-1 text-[11px] font-medium ${textClass}`}>
        {label}
      </p>
    </div>
  );
}
