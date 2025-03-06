
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
        className="absolute top-[-20%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-[#D946EF]/20 blur-[120px] animate-pulse-slow"
        style={{ animationDuration: '15s' }}
      />
      
      {/* Blue gradient blur */}
      <div 
        className="absolute bottom-[-10%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-[#2563EB]/20 blur-[100px] animate-pulse-slow"
        style={{ animationDuration: '25s' }}
      />
      
      {/* Smaller purple accent */}
      <div 
        className="absolute top-[30%] left-[10%] w-[15vw] h-[15vw] rounded-full bg-[#D946EF]/15 blur-[80px] animate-pulse-slow"
        style={{ animationDuration: '20s' }}
      />
    </div>
  );
}
