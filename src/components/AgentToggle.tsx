
import React from "react";
import { Switch } from "@/components/ui/switch";

interface AgentToggleProps {
  isActive: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const AgentToggle: React.FC<AgentToggleProps> = ({ isActive, onToggle }) => {
  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
      <Switch 
        checked={isActive} 
        onCheckedChange={(checked) => {}} 
        onClick={onToggle}
        className="data-[state=checked]:bg-foreground dark:data-[state=checked]:bg-white"
      />
      <span className={`text-sm font-medium ${isActive ? 'text-foreground dark:text-white' : 'text-muted-foreground'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};
