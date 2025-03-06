
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export function BackgroundGradient() {
  const { theme } = useTheme();
  
  // Only show gradients in dark mode
  if (theme !== "dark") return null;
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Purple gradient blur */}
      <div 
        className="absolute top-[-10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-[#D946EF]/20 blur-[150px] animate-pulse-slow"
        style={{ animationDuration: '15s' }}
      />
      
      {/* Blue gradient blur */}
      <div 
        className="absolute bottom-[-5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#2563EB]/20 blur-[130px] animate-pulse-slow"
        style={{ animationDuration: '25s' }}
      />
      
      {/* Smaller purple accent */}
      <div 
        className="absolute top-[30%] left-[15%] w-[20vw] h-[20vw] rounded-full bg-[#D946EF]/15 blur-[100px] animate-pulse-slow"
        style={{ animationDuration: '20s' }}
      />
      
      {/* Additional blue accent for more balance */}
      <div 
        className="absolute top-[20%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-[#2563EB]/15 blur-[120px] animate-pulse-slow"
        style={{ animationDuration: '18s' }}
      />
    </div>
  );
}
