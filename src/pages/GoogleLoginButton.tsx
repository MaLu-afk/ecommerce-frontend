// src/pages/GoogleLoginButton.tsx
import { useEffect } from "react";
import { http } from "../api/http";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  const { setSession } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const redirectAfterLogin = (user: any) => {
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

  const handleGoogleResponse = async (response: any) => {
    try {
      const token = response.credential;
      const res = await http.post("/google-login", { token });
      const { token: apiToken, user } = res.data;
      setSession(apiToken, user);
      redirectAfterLogin(user);
    } catch (error) {
      console.error("Error Google Login:", error);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("⚠️ Falta configurar VITE_GOOGLE_CLIENT_ID en .env");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      //  botón  de Google
      window.google.accounts.id.renderButton(
        document.getElementById("hiddenGoogleDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 
  const triggerGoogleSignIn = () => {
    const hiddenButton = document.querySelector(
      "#hiddenGoogleDiv div[role='button']"
    ) as HTMLElement;
    hiddenButton?.click();
  };

  return (
    <div className="mt-3">
      <button
        onClick={triggerGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#8a7e7e] bg-white rounded-xl font-semibold text-[#4A4A4A] shadow-md transition-all duration-200 hover:bg-[#d8b7b8] hover:text-white hover:shadow-lg active:scale-[0.98]"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-4 w-4"
        />
        <span>Continuar con Google</span>
      </button>
      <div id="hiddenGoogleDiv" className="hidden"></div>
    </div>
  );
}
