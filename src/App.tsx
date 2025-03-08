
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme"; // Updated import path to match actual file location
import { Toaster } from "@/components/ui/sonner";
import AgentsLayout from "@/layouts/AgentsLayout";
import Index from "@/pages/Index";
import AgentsDashboard from "@/pages/AgentsDashboard";
import AgentDetails from "@/pages/AgentDetails";
import AgentCreate from "@/pages/AgentCreate";
import AgentAnalytics from "@/pages/AgentAnalytics";
import NotFound from "@/pages/NotFound";

import "@/App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ai-agents-theme-preference">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agents" element={<AgentsLayout />}>
            <Route index element={<AgentsDashboard />} />
            <Route path=":agentId" element={<AgentDetails />} />
            <Route path=":agentId/analytics" element={<AgentAnalytics />} />
            <Route path="create" element={<AgentCreate />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
