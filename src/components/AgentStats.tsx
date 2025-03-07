
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AgentStatsProps {
  avmScore: number;  // 1-10 score
  interactionCount: number;
}

export const AgentStats: React.FC<AgentStatsProps> = ({ avmScore, interactionCount }) => {
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
  
  const interactionTier = getInteractionTier(interactionCount);
  
  return (
    <div className="flex gap-3 w-full">
      {/* AVM Score Card */}
      <Card className="flex-1 overflow-hidden shadow-sm dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white">
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">AVM Score</span>
          <div className={`w-3 h-3 rounded-full ${getScoreColor(avmScore)}`}></div>
        </div>
        <CardContent className="p-3 text-center">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">{avmScore.toFixed(2)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/10</span>
        </CardContent>
      </Card>

      {/* Interactions Card */}
      <Card className="flex-1 overflow-hidden shadow-sm dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white">
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Interactions</span>
          <span className={`text-xs font-medium ${interactionTier.color}`}>{interactionTier.label}</span>
        </div>
        <CardContent className="p-3 text-center">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {interactionCount >= 1000 
              ? `${(interactionCount / 1000).toFixed(1)}k` 
              : interactionCount}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};
