import { Button } from "@/components/ui/button";
import { MessageSquare, Table, Kanban, Calculator, Users, ShieldCheck, RefreshCw, Settings, Mail, BriefcaseBusiness } from "lucide-react"; // 新增 Users, ShieldCheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ViewType = "chat" | "table" | "kanban" | "virtual-rate";

interface DashboardSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCollapsed: boolean;
}

const DashboardSidebar = ({
                            currentView,
                            onViewChange,
                            isCollapsed,
                          }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 使用 useAuth Hook 获取用户信息

  const menuItems = [
    {
      id: "chat" as ViewType,
      label: "Chat",
      icon: MessageSquare,
      path: "/dashboard",
      requiredRoles: [] // 所有登录用户可见
    },
    {
      id: "table" as ViewType,
      label: "Shipments",
      icon: BriefcaseBusiness,
      path: "/shipments",
      requiredRoles: []
    },
    {
      id: "kanban" as ViewType,
      label: "Tasks",
      icon: Kanban,
      path: "/dashboard", // 假设 kanban 也在 /dashboard 下
      requiredRoles: []
    },
    {
      id: "virtual-rate" as ViewType,
      label: "Virtual Rates",
      icon: Calculator,
      path: "/submit-rates",
      requiredRoles: ["admin", "sales_manager", "operations"]
    },
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
      requiredRoles: ["admin"],
    },
    {
      id: "role-management",
      label: "Role Management",
      icon: ShieldCheck,
      path: "/admin/roles",
      requiredRoles: ["admin"],
    },
    // 其他可能的菜单项
  ];

  // 检查用户是否拥有所需角色
  const hasRequiredRole = (item: { requiredRoles: string[] }) => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true; // 没有角色限制，所有登录用户可见
    }
    return user && item.requiredRoles.includes(user.role);
  };

  // 过滤出用户有权访问的菜单项
  const filteredMenuItems = menuItems.filter(hasRequiredRole);

  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-64"} bg-slate-50 border-r border-slate-200 ${isCollapsed ? "p-2" : "p-4"} h-full transition-all duration-300`}
    >
      <div className="space-y-2">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-slate-700 mb-4 px-2"></h2>
        )}

        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.pathname.startsWith(item.path);

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center p-2" : "justify-start space-x-3 p-3"} h-auto ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && (
                <div className="text-left">
                  {item.label}
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </aside>
  );
};

export default DashboardSidebar;