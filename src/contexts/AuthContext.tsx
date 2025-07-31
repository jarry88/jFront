import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthStorage, ApiClient, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 检查本地存储的用户信息
        const storedUser = AuthStorage.getUserInfo();
        if (storedUser && AuthStorage.isLoggedIn()) {
          // 验证token是否仍然有效
          const isValid = await ApiClient.validateToken();
          if (isValid) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Token无效，清除本地存储
            AuthStorage.clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        AuthStorage.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 监听localStorage变化（用于多标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "user_info") {
        const storedUser = AuthStorage.getUserInfo();
        const isLoggedIn = AuthStorage.isLoggedIn();
        
        if (storedUser && isLoggedIn) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // 调用后端登出API
      await ApiClient.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
      // 即使后端登出失败，也要清除本地状态
    } finally {
      // 清除本地存储和状态
      AuthStorage.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await ApiClient.getCurrentUser();
      setUser(currentUser);
      
      // 更新localStorage中的用户信息
      if (AuthStorage.getAccessToken()) {
        AuthStorage.saveLoginData({
          user: currentUser,
          token: {
            access_token: AuthStorage.getAccessToken() || "",
            token_type: AuthStorage.getTokenType() || "bearer",
            expires_in: 1800,
          },
        });
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // 如果刷新失败，可能token已过期
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 