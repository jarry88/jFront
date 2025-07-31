import { Button } from "@/components/ui/button";
import { MessageSquare, Table, Kanban, Calculator } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const menuItems = [
    {
      id: "chat" as ViewType,
      label: "Chat Interface",
      icon: MessageSquare,
      description: "AI-powered conversations",
    },
    {
      id: "table" as ViewType,
      label: "Table View",
      icon: Table,
      description: "Data in structured format",
    },
    {
      id: "kanban" as ViewType,
      label: "Task View",
      icon: Kanban,
      description: "Kanban board management",
    },
    {
      id: "virtual-rate" as ViewType,
      label: "Virtual Rate Administration",
      icon: Calculator,
      description: "Rate management & analysis",
    },
  ];

  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-64"} bg-slate-50 border-r border-slate-200 ${isCollapsed ? "p-2" : "p-4"} h-full transition-all duration-300`}
    >
      <div className="space-y-2">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-slate-700 mb-4 px-2"></h2>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full ${isCollapsed ? "justify-center p-2" : "justify-start space-x-3 p-3"} h-auto ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              onClick={() => onViewChange(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && (
                <div className="text-left">
                  {item.id === "chat" ? "Chat" : item.label}
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
