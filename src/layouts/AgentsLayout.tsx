
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bot } from "lucide-react";

const AgentsLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b border-border p-4 flex justify-between items-center">
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
