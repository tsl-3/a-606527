
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, PhoneCall, Bot, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);
  
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Select a User Persona</DialogTitle>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a persona to role-play with and practice your agent responses
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="relative rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:border-primary dark:hover:border-primary transition-all"
              onMouseEnter={() => setHoveredPersona(persona.id)}
              onMouseLeave={() => setHoveredPersona(null)}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                  {persona.type === "customer" ? (
                    <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Bot className="h-6 w-6 text-primary dark:text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{persona.name}</h3>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {persona.type === "customer" ? "Customer" : "Training Bot"}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {persona.description}
              </p>

              {persona.scenario && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">Scenario:</span> {persona.scenario}
                </div>
              )}

              {hoveredPersona === persona.id && (
                <div className="absolute inset-0 bg-black/5 dark:bg-black/30 rounded-lg flex items-center justify-center">
                  <Button
                    onClick={() => onSelectPersona(persona)}
                    variant="contrast"
                    className="gap-2"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
