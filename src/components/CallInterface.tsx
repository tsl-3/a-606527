
import React, { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, MessageCircle, User, Bot } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserPersona {
  id: string;
  name: string;
  type: "customer" | "agent" | "bot";
  description: string;
  scenario?: string;
}

interface CallInterfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: UserPersona | null;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  open,
  onOpenChange,
  persona
}) => {
  const [callStatus, setCallStatus] = useState<"connecting" | "active" | "ended">("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<Array<{ sender: "agent" | "user"; text: string; timestamp: string }>>([]);

  // Simulate connection delay
  useEffect(() => {
    if (open && callStatus === "connecting") {
      const timer = setTimeout(() => {
        setCallStatus("active");
        
        // Add initial message from persona
        if (persona) {
          const initialMessage = getInitialMessage(persona);
          setMessages([{
            sender: "user",
            text: initialMessage,
            timestamp: formatTimestamp(new Date())
          }]);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [open, callStatus, persona]);

  // Simulate call duration timer
  useEffect(() => {
    let interval: number | null = null;
    
    if (open && callStatus === "active") {
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, callStatus]);

  const getInitialMessage = (persona: UserPersona): string => {
    switch (persona.id) {
      case "1": return "Hi there! I'm interested in learning more about your product. Can you tell me about the basic features?";
      case "2": return "I've been trying to use your software for hours and I'm really frustrated. Nothing is working!";
      case "3": return "Hello, I've been using your service for a while now and I'm thinking about upgrading. What options do you have?";
      case "4": return "Hello agent, I'll be simulating various customer scenarios. Let's start with a basic inquiry about your product.";
      case "5": return "Hi, I've been comparing your product with your competitors. I have some technical questions.";
      case "6": return "I'm considering cancelling my subscription. I'm not happy with the recent changes you've made.";
      default: return "Hello, how can you help me today?";
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      onOpenChange(false);
      // Reset state when dialog closes
      setTimeout(() => {
        setCallStatus("connecting");
        setCallDuration(0);
        setMessages([]);
      }, 300);
    }, 1000);
  };

  const handleSendMessage = () => {
    // Simple demo - in a real app, you would integrate with a voice/chat API
    const newMessage = {
      sender: "agent" as const,
      text: "I understand your concerns. Let me help you with that issue...",
      timestamp: formatTimestamp(new Date())
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate response from persona
    setTimeout(() => {
      const response = {
        sender: "user" as const,
        text: "That sounds great. Can you provide more details?",
        timestamp: formatTimestamp(new Date())
      };
      setMessages(prev => [...prev, response]);
    }, 3000);
  };

  if (!persona) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {persona.type === "customer" ? (
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Bot className="h-5 w-5 text-primary" />
              )}
              <span>{persona.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
              {callStatus === "connecting" ? (
                "Connecting..."
              ) : (
                <span className="text-green-500 dark:text-green-400">
                  {formatDuration(callDuration)}
                </span>
              )}
            </div>
          </AlertDialogTitle>
          
          {callStatus === "connecting" && (
            <div className="py-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 relative">
                {persona.type === "customer" ? (
                  <User className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Bot className="h-8 w-8 text-primary" />
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Connecting...</h3>
              <Progress value={45} className="w-48 h-1" />
            </div>
          )}
        </AlertDialogHeader>

        {callStatus === "active" && (
          <>
            <div className="max-h-60 overflow-y-auto border rounded-md p-3 mb-4">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`mb-3 ${message.sender === "agent" ? "text-right" : "text-left"}`}
                >
                  <div 
                    className={`inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === "agent" 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                </div>
              ))}
            </div>

            <AlertDialogDescription>
              <div className="text-xs text-gray-500 mb-2">
                {persona.scenario && (
                  <span>Scenario: {persona.scenario}</span>
                )}
              </div>
            </AlertDialogDescription>
          </>
        )}

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <div className="flex items-center gap-2 w-full justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800/30" : ""}
            >
              {isMuted ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleSendMessage}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
