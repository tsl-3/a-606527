
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export function BackgroundGradient() {
  const { theme } = useTheme();
  
  // Only show gradients in dark mode
  if (theme !== "dark") return null;
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Main large blue gradient in bottom left */}
      <div 
        className="absolute bottom-[-10%] left-[-5%] w-[70vw] h-[70vw] rounded-full bg-[#2563EB]/10 blur-[180px] animate-pulse-slow"
        style={{ animationDuration: '30s' }}
      />
      
      {/* Purple gradient in top right */}
      <div 
        className="absolute top-[-10%] right-[0%] w-[60vw] h-[60vw] rounded-full bg-[#8B5CF6]/8 blur-[180px] animate-pulse-slow"
        style={{ animationDuration: '25s' }}
      />

      {/* Additional subtle blue accent */}
      <div 
        className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#2563EB]/5 blur-[150px] animate-pulse-slow"
        style={{ animationDuration: '28s' }}
      />
    </div>
  );
}
