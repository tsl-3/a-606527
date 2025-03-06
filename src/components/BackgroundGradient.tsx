
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export function BackgroundGradient() {
  const { theme } = useTheme();
  
  // Only show gradients in dark mode
  if (theme !== "dark") return null;
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-r from-[#041641] to-[#25052A]">
      {/* Additional subtle overlay gradients for depth */}
      <div 
        className="absolute bottom-[-10%] left-[-5%] w-[70vw] h-[70vw] rounded-full bg-[#2563EB]/5 blur-[180px] animate-pulse-slow"
        style={{ animationDuration: '30s' }}
      />
      
      <div 
        className="absolute top-[-10%] right-[0%] w-[60vw] h-[60vw] rounded-full bg-[#8B5CF6]/5 blur-[180px] animate-pulse-slow"
        style={{ animationDuration: '25s' }}
      />
    </div>
  );
}
