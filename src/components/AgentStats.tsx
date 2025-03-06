
import React from "react";
import { Star, MessageCircle } from "lucide-react";

interface AgentStatsProps {
  avmScore: number;  // 1-10 score
  interactionCount: number;
}

export const AgentStats: React.FC<AgentStatsProps> = ({ avmScore, interactionCount }) => {
  // Color gradient for AVM score based on the value range
  const getScoreColor = (score: number): string => {
    if (score >= 9) return "bg-gradient-to-r from-[#2563EB] to-[#D946EF]"; // 9-10: blue to purple (Anyreach colors)
    if (score >= 7) return "bg-gradient-to-r from-blue-500 to-cyan-500";   // 7-8: blue to cyan
    return "bg-gradient-to-r from-orange-500 to-yellow-400";                // below 6: orange to yellow
  };
  
  return (
    <div className="flex gap-3 w-full">
      {/* AVM Score Card */}
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900/60">
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">AVM Score</span>
          <div className={`w-3 h-3 rounded-full ${getScoreColor(avmScore)}`}></div>
        </div>
        <div className="p-3 text-center">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">{avmScore.toFixed(2)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/10</span>
        </div>
      </div>

      {/* Interactions Card */}
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900/60">
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Interactions</span>
          <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <div className="p-3 text-center">
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
