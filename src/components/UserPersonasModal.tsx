
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Bot } from "lucide-react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserPersona {
  id: string;
  name: string;
  type: "customer" | "agent" | "bot";
  description: string;
  scenario?: string;
}

interface UserPersonasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPersona: (persona: UserPersona) => void;
}

export const UserPersonasModal: React.FC<UserPersonasModalProps> = ({
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-[#0F172A] border-[#1E293B] text-white">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-5 w-5 text-white" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-white">Select a User Persona</DialogTitle>
          <p className="text-gray-400">
            Choose a persona to role-play with and practice your agent responses
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
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
      </DialogContent>
    </Dialog>
  );
};
