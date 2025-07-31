import { LoginForm } from "./LoginForm";
import { UserProfile } from "./UserProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Globe, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const AuthDemo = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Janus Authentication Demo
          </h1>
          <p className="text-gray-600">
            Frontend and Backend Integration Test
          </p>
        </div>

        {/* 系统状态信息 */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Status
              </CardTitle>
              <CardDescription>
                Current system connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Frontend:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Backend:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    http://localhost:8000
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Auth Status:</span>
                  <Badge 
                    variant="outline" 
                    className={isAuthenticated 
                      ? "bg-green-100 text-green-800 border-green-300" 
                      : "bg-red-100 text-red-800 border-red-300"
                    }
                  >
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧 - 登录表单或用户信息 */}
            <div className="space-y-6">
              {!isAuthenticated ? (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Login
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Use one of the demo accounts to test the authentication
                    </p>
                  </div>
                  <LoginForm />
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      User Profile
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Current user information and logout functionality
                    </p>
                  </div>
                  <UserProfile />
                </div>
              )}
            </div>

            {/* 右侧 - 测试信息 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demo Accounts</CardTitle>
                  <CardDescription>
                    Test accounts available for authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Username</p>
                        <p className="text-gray-600">admin</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Password</p>
                        <p className="text-gray-600">admin123</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Username</p>
                        <p className="text-gray-600">sales_manager</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Password</p>
                        <p className="text-gray-600">sales123</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Username</p>
                        <p className="text-gray-600">customer1</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Password</p>
                        <p className="text-gray-600">customer123</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>
                    Available backend API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                        POST
                      </Badge>
                      <code className="text-gray-700">/api/v1/auth/login</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                        GET
                      </Badge>
                      <code className="text-gray-700">/api/v1/auth/me</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                        POST
                      </Badge>
                      <code className="text-gray-700">/api/v1/auth/logout</code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>
                    Implemented authentication features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>JWT Token Authentication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Password Handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Local Storage Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Error Handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Role-Based Access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 