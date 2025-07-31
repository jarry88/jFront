import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Mail,
  BarChart3,
  Maximize2,
  Send,
  MessageSquare,
  Calculator,
  Globe,
  Bell,
} from "lucide-react";
import VirtualRateChat from "./virtual-rate/VirtualRateChat";
import CustomerPortManagement from "./virtual-rate/CustomerPortManagement";
import EmailDraftManager from "./virtual-rate/EmailDraftManager";
import RateComparisonTool from "./virtual-rate/RateComparisonTool";

type RightPanelView = "customers" | "emails" | "rates";

const VirtualRateAdministration = () => {
  const [rightPanelView, setRightPanelView] = useState<RightPanelView>("rates");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const navigationItems = [
    {
      id: "customers" as RightPanelView,
      label: "Customer Management",
      icon: Users,
      description: "Port pairs & subscriptions",
    },
    {
      id: "emails" as RightPanelView,
      label: "Email Drafts",
      icon: Mail,
      description: "Templates & campaigns",
    },
    {
      id: "rates" as RightPanelView,
      label: "Rate Comparison",
      icon: BarChart3,
      description: "Multi-carrier analysis",
    },
  ];

  if (isFullScreen) {
    return (
      <div className="h-full bg-white">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Email Management - Full Screen
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(false)}
            className="space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Back to Split View</span>
          </Button>
        </div>
        <div className="p-6">
          <EmailDraftManager isFullScreen={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-slate-50">
      {/* Left Panel - Chat Interface */}
      <div className="w-1/2 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Virtual Rate Assistant
              </h2>
              <p className="text-sm text-slate-600">
                AI-powered rate management and customer communication
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">47</div>
              <div className="text-xs text-slate-600">Active Subscriptions</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">23</div>
              <div className="text-xs text-slate-600">Draft Emails</div>
            </div>
            <div className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-600">156</div>
              <div className="text-xs text-slate-600">Rate Updates</div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <VirtualRateChat onRightPanelChange={setRightPanelView} />
        </div>
      </div>

      {/* Right Panel - Data Interaction */}
      <div className="w-1/2 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Data Management
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreen(true)}
                className="space-x-2"
                disabled={rightPanelView !== "emails"}
              >
                <Maximize2 className="w-4 h-4" />
                <span>Full Screen</span>
              </Button>
              <Button variant="outline" size="sm" className="space-x-2">
                <Bell className="w-4 h-4" />
                <span>Alerts</span>
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = rightPanelView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setRightPanelView(item.id)}
                  className={`flex-1 space-x-2 ${
                    isActive ? "bg-white shadow-sm" : "hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto">
          {rightPanelView === "customers" && <CustomerPortManagement />}
          {rightPanelView === "emails" && <EmailDraftManager />}
          {rightPanelView === "rates" && <RateComparisonTool />}
        </div>
      </div>
    </div>
  );
};

export default VirtualRateAdministration;
