import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bot, Search, CircleSlash, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AgentType } from "@/types/agent";
import { useAgents } from "@/hooks/useAgents";

const AgentsDashboard = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const filter = searchParams.get("filter") || "all-agents";
  
  const { agents, isLoading, error } = useAgents(filter);
  const [filteredAgents, setFilteredAgents] = useState<AgentType[]>([]);
  
  useEffect(() => {
    if (agents) {
      setFilteredAgents(
        agents.filter(agent => 
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [agents, searchTerm]);

  const getFilterTitle = () => {
    switch (filter) {
      case "my-agents":
        return "My Agents";
      case "team-agents":
        return "Team Agents";
      default:
        return "All Agents";
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <CircleSlash className="h-16 w-16 text-agent-error opacity-80" />
        <h2 className="text-2xl font-semibold text-agent-dark">Error Loading Agents</h2>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-agent-dark tracking-tight">{getFilterTitle()}</h1>
          <p className="text-gray-500 mt-1">Manage and monitor your intelligent agents</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/agents/create" className="agent-button">
            Create Agent
          </Link>
        </div>
      </div>
      
      <Separator />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-agent-primary animate-spin" />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Bot className="h-16 w-16 text-gray-300" />
          <h2 className="text-2xl font-semibold text-agent-dark">No Agents Found</h2>
          <p className="text-gray-500">
            {searchTerm ? "Try a different search term" : "Create your first agent to get started"}
          </p>
          {!searchTerm && (
            <Link to="/agents/create" className="agent-button mt-2">
              Create Your First Agent
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Link to={`/agents/${agent.id}`} key={agent.id} className="block">
              <Card className="h-full card-hover bg-[#041641]/80">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={agent.status === "active" ? "default" : "secondary"} className="mb-2">
                      {agent.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    {agent.isPersonal && (
                      <Badge variant="outline" className="bg-agent-secondary text-agent-primary border-none">
                        Personal
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Created {agent.createdAt}</span>
                    <span>•</span>
                    <span>{agent.type}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <span className="font-medium text-agent-primary">{agent.interactions}</span>
                    <span>interactions</span>
                  </div>
                  <div className="text-sm text-agent-primary font-medium">View Details &rarr;</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsDashboard;
