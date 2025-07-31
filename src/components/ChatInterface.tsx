import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onMessagesChange?: (hasMessages: boolean) => void;
}

const ChatInterface = ({ onMessagesChange }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setInputValue("");

      // Notify parent that we have messages
      onMessagesChange?.(true);

      // Simulate assistant response with smart responses
      setTimeout(() => {
        let responseText =
          "I'm here to help you with your freight operations. How can I assist you today?";

        // Smart response for Shanghai to Rotterdam rates
        if (
          inputValue.toLowerCase().includes("shanghai") &&
          inputValue.toLowerCase().includes("rotterdam") &&
          inputValue.toLowerCase().includes("rate")
        ) {
          responseText = `Here are the current freight rates from Shanghai to Rotterdam:

**Container Rates (as of ${new Date().toLocaleDateString()}):**
• 20ft Container: $2,850 - $3,200
• 40ft Container: $4,200 - $4,650
• 40ft High Cube: $4,350 - $4,800

**Transit Time:** 28-35 days
**Available Carriers:** Maersk, COSCO, MSC, CMA CGM
**Port Surcharges:** Shanghai: $125, Rotterdam: $180

*Note: Rates are subject to fuel surcharges and seasonal adjustments. Would you like me to check specific carrier availability or provide a detailed quote?*`;
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: "assistant",
          timestamp: new Date(),
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
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate transcription
      setTimeout(() => {
        setInputValue("Container MSKU7845123 status update please");
      }, 1000);
    } else {
      // Start recording
      setIsRecording(true);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <img
                  src="https://cdn.builder.io/api/v1/assets/566304424392498fb70956fc16b27686/janus-logo-source-file-01-950bb6?format=webp&width=800"
                  alt="Janus Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Welcome to Janus AI Assistant
                </h3>
                <p className="text-slate-600 max-w-md">
                  I'm here to help you with freight operations, documentation,
                  tracking, and more. Ask me anything about your logistics
                  needs.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-slate-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isRecording
                ? "Recording... speak now"
                : "what do you need to know?"
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

export default ChatInterface;
