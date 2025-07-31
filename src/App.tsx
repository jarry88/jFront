// src/App.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ShipmentDetail from "./pages/ShipmentDetail";
import ShipmentDetailNew from "./pages/ShipmentDetailNew";
import ShipmentList from "./pages/ShipmentList";
import CRMProfile from "./pages/CRMProfile";
import RateSubmission from "./pages/RateSubmission";
import NotFound from "./pages/NotFound";
import { AuthDemo } from "./components/AuthDemo";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { AuthStorage } from "./lib/api";

// 导入新的用户和角色管理页面
import UserList from "./pages/UserList";
import UserForm from "./pages/UserForm";
import RoleList from "./pages/RoleList";
import RoleForm from "./pages/RoleForm";


const queryClient = new QueryClient();

// 临时在此文件中定义 LoginPage 组件
const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 如果用户已经登录，直接跳转到dashboard
    if (AuthStorage.isLoggedIn()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/auth-demo" element={<AuthDemo />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* --- User Management Routes --- */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/new"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            {/* --- Role Management Routes --- */}
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <RoleList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles/new"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <RoleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles/edit/:id"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <RoleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute>
                  <ShipmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipment/:id"
              element={
                <ProtectedRoute>
                  <ShipmentDetailNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/:id"
              element={
                <ProtectedRoute requiredRoles={["admin", "sales_manager", "sales_rep", "customer_service"]}>
                  <CRMProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit-rates"
              element={
                <ProtectedRoute requiredRoles={["admin", "sales_manager", "operations"]}>
                  <RateSubmission />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;