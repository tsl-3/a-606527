
import React from "react";
import { Mic } from "lucide-react";

export interface LiveTranscriptionProps {
  text: string;
}

export const LiveTranscription: React.FC<LiveTranscriptionProps> = ({ text }) => {
  return (
    <div className="bg-secondary/50 border rounded-lg p-3 flex items-start gap-2">
      <Mic className="h-4 w-4 text-red-500 mt-0.5 animate-pulse" />
      <div className="flex-1">
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};
