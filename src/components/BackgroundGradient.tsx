
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export function BackgroundGradient() {
  const { theme } = useTheme();
  
  // Only show gradients in dark mode
  if (theme !== "dark") return null;
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Purple gradient blur - more pronounced */}
      <div 
        className="absolute top-[-5%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#D946EF]/20 blur-[180px] animate-pulse-slow"
        style={{ animationDuration: '20s' }}
      />
      
      {/* Blue gradient blur - larger and more visible */}
      <div 
        className="absolute bottom-[-10%] left-[5%] w-[55vw] h-[55vw] rounded-full bg-[#2563EB]/20 blur-[160px] animate-pulse-slow"
        style={{ animationDuration: '25s' }}
      />
      
      {/* Small purple accent - for additional depth */}
      <div 
        className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-[#D946EF]/15 blur-[120px] animate-pulse-slow"
        style={{ animationDuration: '18s' }}
      />
      
      {/* Small blue accent - for balance */}
      <div 
        className="absolute top-[15%] right-[25%] w-[35vw] h-[35vw] rounded-full bg-[#2563EB]/15 blur-[150px] animate-pulse-slow"
        style={{ animationDuration: '22s' }}
      />
    </div>
  );
}
