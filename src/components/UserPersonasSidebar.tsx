
import React from "react";
import { Button } from "@/components/ui/button";
import { User, Bot, X, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserPersona {
  id: string;
  name: string;
  type: "customer" | "agent" | "bot";
  description: string;
  scenario?: string;
}

interface UserPersonasSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPersona: (persona: UserPersona) => void;
}

export const UserPersonasSidebar: React.FC<UserPersonasSidebarProps> = ({
  open,
  onOpenChange,
  onSelectPersona,
}) => {
  const personas: UserPersona[] = [
    {
      id: "1",
      name: "Jane Smith",
      type: "customer",
      description: "First-time customer with basic questions about your product",
      scenario: "Wants to understand your product features and pricing"
    },
    {
      id: "2",
      name: "Michael Brown",
      type: "customer",
      description: "Frustrated customer having technical issues",
      scenario: "Has tried troubleshooting but can't resolve the problem"
    },
    {
      id: "3",
      name: "Sarah Johnson",
      type: "customer",
      description: "High-value customer considering an upgrade",
      scenario: "Currently using your basic tier but interested in premium features"
    },
    {
      id: "4",
      name: "Training Bot",
      type: "bot",
      description: "AI-powered training assistant",
      scenario: "Will simulate various customer scenarios to help train your agent"
    },
    {
      id: "5",
      name: "Robert Chen",
      type: "customer",
      description: "New customer with detailed technical questions",
      scenario: "Evaluating your product against competitors"
    },
    {
      id: "6",
      name: "Emily Davis",
      type: "customer",
      description: "Customer considering cancellation",
      scenario: "Unhappy with recent changes to your service"
    }
  ];

  const handleSelectPersona = (persona: UserPersona) => {
    onSelectPersona(persona);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-[#0F172A] border-l border-[#1E293B] shadow-xl transition-transform duration-300 ease-in-out overflow-hidden flex flex-col",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 rounded-full hover:bg-[#1E293B]"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-white">Select a User Persona</h2>
              <p className="text-sm text-gray-400">
                Choose a persona to role-play with
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-[#1E293B]"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>
        
        {/* Content */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="border border-[#1E293B] rounded-lg bg-[#111827] overflow-hidden cursor-pointer hover:bg-[#141e33] transition-colors"
                onClick={() => handleSelectPersona(persona)}
              >
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-[#1E293B] rounded-full p-2">
                      {persona.type === "customer" ? (
                        <User className="h-5 w-5 text-gray-300" />
                      ) : (
                        <Bot className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{persona.name}</h3>
                      <Badge 
                        className={cn(
                          "mt-1 px-3 py-0.5 rounded-full text-xs font-normal",
                          persona.type === "bot" ? "bg-[#1E293B] text-gray-300" : "bg-[#1E293B] text-gray-300"
                        )}
                      >
                        {persona.type === "bot" ? "Training Bot" : "Customer"}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">
                    {persona.description}
                  </p>
                  
                  {persona.scenario && (
                    <div className="bg-[#1E293B] rounded p-3 text-xs text-gray-300 mb-2">
                      <span className="text-gray-400">Scenario:</span> {persona.scenario}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
