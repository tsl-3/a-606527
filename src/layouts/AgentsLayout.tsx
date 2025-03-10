
import { Outlet } from "react-router-dom";

const AgentsLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AgentsLayout;
