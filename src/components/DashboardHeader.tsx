import { Button } from "@/components/ui/button";
import { Settings, MessageCircle, Mail, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSettingsClick = () => {
    // TODO: Implement settings functionality
    console.log("Settings clicked");
  };

  const handleHelpChatClick = () => {
    // TODO: Implement Janus Bot chat functionality
    console.log("Help chat clicked");
  };

  const handleRateSubmissionClick = () => {
    navigate("/submit-rates");
  };

  const handleUserAdminClick = () => {
    navigate("/admin/users");
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img
            src="https://cdn.builder.io/api/v1/assets/566304424392498fb70956fc16b27686/janus-logo-source-file-01-950bb6?format=webp&width=800"
            alt="Janus Logo"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">Janus</h1>
            <p className="text-xs text-muted-foreground">
              Back-office operations for freight forwarders
            </p>
          </div>
        </div>

        {/* Right side - Settings, Help, User */}
        <div className="flex items-center space-x-4">
          {/* User Admin (only for admin users) */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUserAdminClick}
              className="hover:bg-slate-100"
              title="User Management"
            >
              <Users className="w-5 h-5" />
            </Button>
          )}

          {/* Rate Submission */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRateSubmissionClick}
            className="hover:bg-slate-100"
            title="Submit Rates"
          >
            <Mail className="w-5 h-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettingsClick}
            className="hover:bg-slate-100"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* Help Chat */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpChatClick}
            className="hover:bg-slate-100"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* User Name */}
          <div className="text-sm font-medium text-foreground">
            {user ? `${user.first_name} ${user.last_name}` : "User"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
