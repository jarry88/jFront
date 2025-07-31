import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Mail, Building, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const UserProfile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await refreshUser();
    } catch (error) {
      console.error("Failed to refresh user info:", error);
      setError(error instanceof Error ? error.message : "Failed to refresh user info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            No user information available. Please log in first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-300";
      case "sales_manager":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "sales_rep":
        return "bg-green-100 text-green-800 border-green-300";
      case "customer":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "operations":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "customer_service":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "finance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          User Profile
        </CardTitle>
        <CardDescription>
          Current user information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Name:</span>
            <span className="font-medium">
              {user.first_name} {user.last_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Username:</span>
            <span className="font-medium">{user.username}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Role:</span>
            <Badge 
              variant="outline" 
              className={getRoleBadgeColor(user.role)}
            >
              {user.role}
            </Badge>
          </div>

          {user.company_id && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Company ID:</span>
              <span className="font-medium">{user.company_id}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Login:</span>
            <span className="font-medium">
              {user.last_login 
                ? new Date(user.last_login).toLocaleString()
                : "Never"
              }
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="font-medium">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge 
              variant="outline" 
              className={user.is_active 
                ? "bg-green-100 text-green-800 border-green-300" 
                : "bg-red-100 text-red-800 border-red-300"
              }
            >
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshUser}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="ml-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 