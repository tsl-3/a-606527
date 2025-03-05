
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AgentsSidebar from "@/components/AgentsSidebar";

const AgentsLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-agent-light">
        <AgentsSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgentsLayout;
