
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Zap } from "lucide-react";

interface AgentStatsProps {
  avmScore: number;  // 1-10 score
  interactionCount: number;
  csat?: number;  // 0-100 percentage
  performance?: number; // 0-100 percentage
  compact?: boolean; // If true, only show first 2 stats
}

export const AgentStats: React.FC<AgentStatsProps> = ({ 
  avmScore, 
  interactionCount, 
  csat = 85, 
  performance = 92,
  compact = false
}) => {
  // Color indicator for AVM score based on the value range
  const getScoreColor = (score: number): string => {
    if (score >= 8) return "bg-green-500"; // High score: green
    if (score >= 6) return "bg-yellow-500"; // Medium score: yellow
    return "bg-red-500"; // Low score: red
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
  
  const interactionTier = getInteractionTier(interactionCount);
  const csatColor = getCsatColor(csat);
  const performanceColor = getPerformanceColor(performance);
  
  return (
    <div className="flex gap-2 w-full">
      {/* AVM Score Card */}
      <Card className="flex-1 overflow-hidden shadow-sm dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white">
        <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">AVM</span>
          <div className={`w-2 h-2 rounded-full ${getScoreColor(avmScore)}`}></div>
        </div>
        <CardContent className="p-2 text-center">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">{avmScore.toFixed(1)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/10</span>
        </CardContent>
      </Card>

      {/* Interactions Card */}
      <Card className="flex-1 overflow-hidden shadow-sm dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white">
        <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Interactions</span>
          <span className={`text-xs font-medium ${interactionTier.color}`}>{interactionTier.label}</span>
        </div>
        <CardContent className="p-2 text-center">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            {interactionCount >= 1000 
              ? `${(interactionCount / 1000).toFixed(1)}k` 
              : interactionCount}
          </span>
        </CardContent>
      </Card>
      
      {/* CSAT Card - Only shown when not in compact mode or part of the first 2 stats */}
      {!compact && (
        <Card className="flex-1 overflow-hidden shadow-sm dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white">
          <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">CSAT</span>
            <Smile className={`w-3.5 h-3.5 ${csatColor}`} />
          </div>
          <CardContent className="p-2 text-center">
            <span className={`text-xl font-semibold ${csatColor}`}>{csat}%</span>
          </CardContent>
        </Card>
      )}
      
      {/* Performance Card - Only shown when not in compact mode */}
      {!compact && (
        <Card className="flex-1 overflow-hidden shadow-sm dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white">
          <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Performance</span>
            <Zap className={`w-3.5 h-3.5 ${performanceColor}`} />
          </div>
          <CardContent className="p-2 text-center">
            <span className={`text-xl font-semibold ${performanceColor}`}>{performance}%</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
