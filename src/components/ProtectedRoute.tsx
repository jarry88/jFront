import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthStorage, ApiClient } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 检查是否有本地存储的token
        if (!AuthStorage.isLoggedIn()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // 验证token是否仍然有效
        const isValid = await ApiClient.validateToken();
        setIsAuthenticated(isValid);
        
        // 如果token无效，清除本地存储
        if (!isValid) {
          AuthStorage.clearAuthData();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        AuthStorage.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 检查用户角色权限
  const checkRolePermission = (): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // 如果没有指定角色要求，则允许所有已登录用户访问
    }

    const userInfo = AuthStorage.getUserInfo();
    if (!userInfo) {
      return false;
    }

    return requiredRoles.includes(userInfo.role);
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // 未登录，重定向到登录页面
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // 已登录但没有权限
  if (!checkRolePermission()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <svg 
              className="w-16 h-16 text-red-500 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Required roles: {requiredRoles?.join(", ")}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 已登录且有权限，渲染子组件
  return <>{children}</>;
}; 