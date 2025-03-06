
import React from "react";
import { Star, MessageCircle } from "lucide-react";

interface AgentStatsProps {
  avmScore: number;  // 1-10 score
  interactionCount: number;
}

export const AgentStats: React.FC<AgentStatsProps> = ({ avmScore, interactionCount }) => {
  // Color gradient for AVM score based on the value range
  const getScoreColor = (score: number): string => {
    if (score >= 9) return "bg-gradient-to-r from-green-500 to-purple-500"; // 9-10: green to purple
    if (score >= 7) return "bg-gradient-to-r from-blue-500 to-green-500";   // 7-8: blue to green
    return "bg-gradient-to-r from-orange-500 to-yellow-400";                // below 6: orange to yellow
  };
  
  return (
    <div className="flex gap-3 w-full">
      {/* AVM Score Card */}
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className={`${getScoreColor(avmScore)} px-3 py-1.5 text-white flex items-center justify-between`}>
          <span className="text-xs font-medium">AVM Score</span>
          <Star className="h-3.5 w-3.5" />
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-900/60">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">{avmScore.toFixed(2)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/10</span>
        </div>
      </div>

      {/* Interactions Card */}
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1.5 text-white flex items-center justify-between">
          <span className="text-xs font-medium">Interactions</span>
          <MessageCircle className="h-3.5 w-3.5" />
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-900/60">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">
            {interactionCount >= 1000 
              ? `${(interactionCount / 1000).toFixed(1)}k` 
              : interactionCount}
          </span>
        </div>
      </div>
    </div>
  );
};
