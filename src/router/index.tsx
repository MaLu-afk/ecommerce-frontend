//src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layouts/RootLayout";
import AdminLayout from "../admin/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import { AdminLoading } from "../admin/components/shared/AdminLoading";

// Lazy loading para todas las páginas
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const CartPage = lazy(() => import("../components/cart/cart"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const MyOrdersPage = lazy(() => import("../pages/MyOrdersPage"));
const Profile = lazy(() => import("../pages/Profile"));

// Admin
const ProductsPage = lazy(() => import("../admin/pages/ProductsPage"));
const CategoriesPage = lazy(() => import("../admin/pages/CategoriesPage"));
const OrdersPage = lazy(() => import("../admin/pages/OrdersPage"));
const DashboardPage = lazy(() => import("../admin/pages/DashboardPage"));
const VistaPreviaPage = lazy(() => import("../admin/pages/VistaPreviaPage"));

// Wrapper
const LazyComponent = ({ component: Component }: { component: React.ComponentType }) => (
  <Suspense fallback={<AdminLoading />}>
    <Component />
  </Suspense>
);

// Nuevas páginas
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerifyCodePage from "../pages/VerifyCodePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LazyComponent component={HomePage} /> },

      { path: "producto/:id", element: <LazyComponent component={ProductDetailPage} /> },

      { path: "cart", element: <LazyComponent component={CartPage} /> },

      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <LazyComponent component={CheckoutPage} />
          </ProtectedRoute>
        ),
      },

      {
        path: "order-success",
        element: (
          <ProtectedRoute>
            <LazyComponent component={OrderSuccessPage} />
          </ProtectedRoute>
        ),
      },

      {
        path: "my-orders",
        element: (
          <ProtectedRoute>
            <LazyComponent component={MyOrdersPage} />
          </ProtectedRoute>
        ),
      },

      // Autenticación
      { path: "login", element: <LazyComponent component={LoginPage} /> },
      { path: "register", element: <LazyComponent component={RegisterPage} /> },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <LazyComponent component={Profile} />
          </ProtectedRoute>
        ) 
      },

      // Tus rutas nuevas
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "verify-code", element: <VerifyCodePage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },

  // Admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },

      { path: "dashboard", element: <LazyComponent component={DashboardPage} /> },

      { path: "productos", element: <LazyComponent component={ProductsPage} /> },

      { path: "categorias", element: <LazyComponent component={CategoriesPage} /> },

      { path: "pedidos", element: <LazyComponent component={OrdersPage} /> },

      { path: "vista-previa", element: <LazyComponent component={VistaPreviaPage} /> },

      { path: "*", element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
]);
