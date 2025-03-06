
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export function BackgroundGradient() {
  const { theme } = useTheme();
  
  // Only show gradients in dark mode
  if (theme !== "dark") return null;
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Purple gradient blur - more subtle positioning */}
      <div 
        className="absolute top-[-5%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#D946EF]/15 blur-[180px] animate-pulse-slow"
        style={{ animationDuration: '20s' }}
      />
      
      {/* Blue gradient blur - positioned to match reference */}
      <div 
        className="absolute bottom-[-10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-[#2563EB]/15 blur-[160px] animate-pulse-slow"
        style={{ animationDuration: '25s' }}
      />
      
      {/* Small purple accent - for additional depth */}
      <div 
        className="absolute top-[40%] left-[20%] w-[20vw] h-[20vw] rounded-full bg-[#D946EF]/10 blur-[100px] animate-pulse-slow"
        style={{ animationDuration: '18s' }}
      />
      
      {/* Small blue accent - for balance */}
      <div 
        className="absolute top-[15%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-[#2563EB]/10 blur-[130px] animate-pulse-slow"
        style={{ animationDuration: '22s' }}
      />
    </div>
  );
}
