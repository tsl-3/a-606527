
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Zap, Info } from "lucide-react";

interface AgentStatsProps {
  avmScore?: number;  // 1-10 score
  interactionCount: number;
  csat?: number;  // 0-100 percentage
  performance?: number; // 0-100 percentage
  compact?: boolean; // If true, only show first 2 stats
  isNewAgent?: boolean; // New flag to indicate a newly created agent
  showZeroValues?: boolean; // If true, show 0 values instead of "No stats yet"
  hideInteractions?: boolean; // New prop to hide interaction count
}

export const AgentStats: React.FC<AgentStatsProps> = ({ 
  avmScore, 
  interactionCount, 
  csat = 85, 
  performance = 92,
  compact = false,
  isNewAgent = false,
  showZeroValues = false,
  hideInteractions = false
}) => {
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
  const displayInteractionCount = isNewAgent ? 0 : interactionCount;
  const displayCsat = isNewAgent && showZeroValues ? 0 : csat;
  const displayPerformance = isNewAgent && showZeroValues ? 0 : performance;

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
  
  // Get color for CSAT score
  const getCsatColor = (score: number): string => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Get color for performance score
  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  const interactionTier = getInteractionTier(displayInteractionCount);
  const csatColor = displayCsat ? getCsatColor(displayCsat) : "text-muted-foreground";
  const performanceColor = displayPerformance ? getPerformanceColor(displayPerformance) : "text-muted-foreground";
  
  // Get the appropriate color class for the AVM score bar
  const scoreColorClass = displayAvmScore !== undefined ? getScoreColor(displayAvmScore) : "bg-gray-400";
  
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Interactions, CSAT and Performance Cards - Now above AVM */}
      <div className="flex gap-2 w-full">
        {/* Interactions Card - Only shown when not hidden */}
        {!hideInteractions && (
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
        )}
        
        {/* CSAT Card - Only shown when not in compact mode and CSAT exists */}
        {!compact && (
          <Card className="flex-1 overflow-hidden shadow-sm">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">CSAT</span>
              <Smile className={`w-3.5 h-3.5 ${csatColor}`} />
            </div>
            <CardContent className="p-2 text-center">
              <span className={`text-xl font-semibold ${csatColor}`}>{displayCsat !== undefined ? displayCsat : 0}%</span>
            </CardContent>
          </Card>
        )}
        
        {/* Performance Card - Only shown when not in compact mode and performance exists */}
        {!compact && (
          <Card className="flex-1 overflow-hidden shadow-sm">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Performance</span>
              <Zap className={`w-3.5 h-3.5 ${performanceColor}`} />
            </div>
            <CardContent className="p-2 text-center">
              <span className={`text-xl font-semibold ${performanceColor}`}>{displayPerformance !== undefined ? displayPerformance : 0}%</span>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AVM Score outside of card - Now below the cards */}
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
