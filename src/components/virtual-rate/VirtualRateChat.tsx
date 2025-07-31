import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  TrendingUp,
  Mail,
  Users,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  actionType?: "rate-comparison" | "email-draft" | "customer-management";
}

interface VirtualRateChatProps {
  onRightPanelChange: (view: "customers" | "emails" | "rates") => void;
}

const VirtualRateChat = ({ onRightPanelChange }: VirtualRateChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to Virtual Rate Administration! I can help you compare rates, draft emails, and manage customer subscriptions. Try asking: 'Show me Shanghai to Hamburg rates' or 'Create an email for Asia customers'",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const query = inputValue.toLowerCase();
      setInputValue("");

      // Process the query and determine response and actions
      setTimeout(() => {
        let responseText = "";
        let actionType:
          | "rate-comparison"
          | "email-draft"
          | "customer-management"
          | undefined;

        if (
          query.includes("rate") ||
          query.includes("price") ||
          query.includes("compare")
        ) {
          responseText = `I'll help you compare rates. Looking at current market data for the requested routes...`;
          actionType = "rate-comparison";
          onRightPanelChange("rates");
        } else if (
          query.includes("email") ||
          query.includes("draft") ||
          query.includes("template")
        ) {
          responseText = `I'll create an email draft for you. Setting up the email composer with relevant templates...`;
          actionType = "email-draft";
          onRightPanelChange("emails");
        } else if (
          query.includes("customer") ||
          query.includes("subscription") ||
          query.includes("port")
        ) {
          responseText = `Managing customer subscriptions and port pair preferences. Loading customer management tools...`;
          actionType = "customer-management";
          onRightPanelChange("customers");
        } else if (query.includes("shanghai") && query.includes("hamburg")) {
          responseText = `Here are the current rates for Shanghai to Hamburg:

**Current Market Rates (per 40ft container):**
• Maersk: $4,200 (Contract) - Transit: 28 days
• CMA CGM: $3,950 (Spot) - Transit: 32 days  
• ONE: $4,100 (Contract) - Transit: 30 days
• Hapag-Lloyd: $4,350 (Contract) - Transit: 26 days

**Demurrage & Detention:**
• Maersk: $150/day demurrage, $200/day detention
• CMA CGM: $140/day demurrage, $180/day detention
• ONE: $160/day demurrage, $210/day detention
• Hapag-Lloyd: $155/day demurrage, $195/day detention

Opening rate comparison tool for detailed analysis...`;
          actionType = "rate-comparison";
          onRightPanelChange("rates");
        } else {
          responseText = `I can help you with:
• **Rate Comparisons** - "Compare rates Shanghai to Hamburg"
• **Email Management** - "Draft email for Asia customers"  
• **Customer Subscriptions** - "Manage port pair subscriptions"
• **Market Analysis** - "Show trending routes"

What would you like to work on?`;
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: "assistant",
          timestamp: new Date(),
          actionType,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputValue(
          "Show me rates from Shanghai to Rotterdam for Maersk and CMA CGM",
        );
      }, 2000);
    }
  };

  const quickActions = [
    {
      label: "Compare Rates",
      icon: TrendingUp,
      action: () => setInputValue("Compare rates for major trade lanes"),
    },
    {
      label: "Draft Email",
      icon: Mail,
      action: () => setInputValue("Create email template for rate updates"),
    },
    {
      label: "Manage Customers",
      icon: Users,
      action: () => setInputValue("Show customer port pair subscriptions"),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {message.sender === "assistant" && (
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">
                    AI Assistant
                  </span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              {message.actionType && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      message.actionType === "rate-comparison"
                        ? "bg-green-100 text-green-800"
                        : message.actionType === "email-draft"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {message.actionType === "rate-comparison"
                      ? "Rate Tool Activated"
                      : message.actionType === "email-draft"
                        ? "Email Composer Ready"
                        : "Customer Manager Open"}
                  </Badge>
                </div>
              )}
              <p
                className={`text-xs mt-2 ${
                  message.sender === "user" ? "text-blue-100" : "text-slate-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="mb-3">
          <p className="text-xs text-slate-600 mb-2">Quick Actions:</p>
          <div className="flex space-x-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="space-x-1 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isRecording
                ? "Recording... speak now"
                : "Ask about rates, emails, or customers..."
            }
            className="flex-1"
            disabled={isRecording}
          />
          <Button
            onClick={handleVoiceToggle}
            size="sm"
            variant={isRecording ? "destructive" : "outline"}
            className={isRecording ? "animate-pulse" : ""}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button onClick={handleSendMessage} size="sm" disabled={isRecording}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualRateChat;
