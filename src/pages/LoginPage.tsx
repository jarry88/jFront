import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";
import { AuthStorage } from "@/lib/api";

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

export default LoginPage; 