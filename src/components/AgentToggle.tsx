
import React from "react";
import { cn } from "@/lib/utils";

interface AgentToggleProps {
  isActive: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const AgentToggle: React.FC<AgentToggleProps> = ({ 
  isActive, 
  onToggle 
}) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex items-center h-8 rounded-full px-2 w-20 transition-colors duration-300",
        isActive 
          ? "bg-agent-primary text-white" 
          : "bg-gray-200 dark:bg-gray-700 text-agent-primary"
      )}
    >
      <span 
        className={cn(
          "absolute w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md",
          isActive ? "translate-x-11" : "translate-x-0"
        )}
      />
      <span 
        className={cn(
          "text-xs font-semibold transition-opacity duration-300 w-full text-center",
          isActive 
            ? "ml-1 opacity-100" 
            : "mr-1 opacity-0"
        )}
      >
        ON
      </span>
      <span 
        className={cn(
          "text-xs font-semibold transition-opacity duration-300 w-full text-center",
          !isActive 
            ? "opacity-100 ml-7" // Changed from "ml-7 opacity-100" to "opacity-100 ml-7" to ensure proper positioning
            : "opacity-0 mr-7"
        )}
      >
        OFF
      </span>
    </button>
  );
};
