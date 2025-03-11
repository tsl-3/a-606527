
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { AgentType } from "@/types/agent";

export interface AgentStatsProps {
  agent?: AgentType;
  avmScore?: number;
  interactionCount?: number;
  compact?: boolean;
  isNewAgent?: boolean;
  showZeroValues?: boolean;
  hideInteractions?: boolean;
}

export const AgentStats: React.FC<AgentStatsProps> = ({ 
  agent,
  avmScore: propAvmScore,
  interactionCount: propInteractionCount,
  isNewAgent = false,
  showZeroValues = false,
  hideInteractions = false,
  compact = false
}) => {
  // Use either direct props or extract from agent object
  const avmScore = propAvmScore !== undefined ? propAvmScore : agent?.avmScore;
  const interactions = propInteractionCount !== undefined ? propInteractionCount : agent?.interactions;

  // For new agents, show a different UI
  if (isNewAgent && !showZeroValues) {
    return (
      <div className="flex gap-2 w-full">
        <Card className="flex-1 overflow-hidden shadow-sm">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Agent Status</span>
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <CardContent className="p-2 text-center text-sm text-muted-foreground">
            New agent - no stats yet
          </CardContent>
        </Card>
      </div>
    );
  }

  // For analytics tab or when showZeroValues is true, show zeros instead of default values
  const displayAvmScore = isNewAgent && showZeroValues ? 0 : avmScore;
  const displayInteractionCount = isNewAgent ? 0 : interactions;

  // Color indicator for AVM score based on the value range
  const getScoreColor = (score: number): string => {
    if (score >= 8) return "bg-green-500"; // High score (8-10): green
    if (score >= 6) return "bg-yellow-500"; // Medium score (6-7): yellow
    return "bg-orange-500"; // Low score (1-5): orange
  };
  
  // Get tier label and color for interaction count
  const getInteractionTier = (count: number): { label: string; color: string } => {
    if (count >= 1000) return { label: "Gold", color: "text-yellow-500" };
    if (count >= 100) return { label: "Silver", color: "text-gray-400" };
    return { label: "Bronze", color: "text-amber-600" };
  };
  
  const interactionTier = getInteractionTier(displayInteractionCount || 0);
  
  // Get the appropriate color class for the AVM score bar
  const scoreColorClass = displayAvmScore !== undefined ? getScoreColor(displayAvmScore) : "bg-gray-400";
  
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Interactions Card - Hidden by default now */}
      {!hideInteractions && (
        <div className="flex gap-2 w-full">
          <Card className="flex-1 overflow-hidden shadow-sm">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Interactions</span>
              <span className={`text-xs font-medium ${interactionTier.color}`}>{interactionTier.label}</span>
            </div>
            <CardContent className="p-2 text-center">
              <span className="text-xl font-semibold">
                {displayInteractionCount >= 1000 
                  ? `${(displayInteractionCount / 1000).toFixed(1)}k` 
                  : displayInteractionCount}
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AVM Score outside of card */}
      {displayAvmScore !== undefined && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">AVM</span>
            <span className="text-xs font-medium">{displayAvmScore !== undefined ? displayAvmScore.toFixed(1) : "0.0"}</span>
          </div>
          <div className="relative w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 h-2">
            <div 
              className={`absolute h-full transition-all duration-300 ease-in-out ${scoreColorClass}`}
              style={{ width: `${displayAvmScore ? (displayAvmScore * 10) : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
