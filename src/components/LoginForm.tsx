import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButton } from "@/components/ui/oauth-button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ApiClient, AuthStorage, type LoginRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const credentials: LoginRequest = {
        username: username.trim(),
        password,
      };

      const loginData = await ApiClient.login(credentials);
      
      // 保存登录数据到localStorage
      AuthStorage.saveLoginData(loginData);

      // 更新全局认证状态
      login(loginData.user, loginData.token.access_token);

      setSuccess(`Welcome back, ${loginData.user.first_name}!`);
      
      console.log("Login successful:", loginData);
      
      // 登录成功后跳转到 dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000); // 延迟1秒显示成功消息后跳转
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "microsoft" | "google") => {
    console.log(`Login with ${provider}`);
    // Handle OAuth login logic here
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          {/* Company Logo */}
          <img
            src="https://cdn.builder.io/api/v1/assets/566304424392498fb70956fc16b27686/janus-logo-source-file-01-950bb6?format=webp&width=800"
            alt="Janus Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your Janus account
          <br />
        </p>
      </div>

       

      

      {/* 显示错误和成功消息 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="h-12"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Demo users: admin, sales_manager, customer1, operations, sales_rep
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo passwords: admin123, sales123, customer123, ops123, rep123
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              disabled={isLoading}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 disabled:opacity-50"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <button
            type="button"
            disabled={isLoading}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button 
            disabled={isLoading}
            className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
          >
            Contact your administrator
          </button>
        </p>
      </div>
    </div>
  );
};
