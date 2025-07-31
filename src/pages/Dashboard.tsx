import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import ChatInterface from "@/components/ChatInterface";
import TableView from "@/components/TableView";
import KanbanView from "@/components/KanbanView";
import VirtualRateAdministration from "@/components/VirtualRateAdministration";

type ViewType = "chat" | "table" | "kanban" | "virtual-rate";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<ViewType>("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMessagesChange = (hasMessages: boolean) => {
    setSidebarCollapsed(hasMessages);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "table":
        return <TableView />;
      case "kanban":
        return <KanbanView />;
      case "virtual-rate":
        return <VirtualRateAdministration />;
      case "chat":
      default:
        return <ChatInterface onMessagesChange={handleMessagesChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 bg-white overflow-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
