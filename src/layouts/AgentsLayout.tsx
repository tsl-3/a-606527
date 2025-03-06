
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bot, Plus } from "lucide-react";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { Link } from "react-router-dom";

const AgentsLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background relative">
      <BackgroundGradient />
      <header className="border-b border-border/40 p-4 flex justify-between items-center backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Agent Hub</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AgentsLayout;
