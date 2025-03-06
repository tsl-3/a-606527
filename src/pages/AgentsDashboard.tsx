
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bot, Search, CircleSlash, Loader2, UserCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { AgentType } from "@/types/agent";
import { useAgents } from "@/hooks/useAgents";

const AgentsDashboard = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const filter = searchParams.get("filter") || "all-agents";
  const { toast } = useToast();
  
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

  const handleToggleStatus = (e: React.MouseEvent, agentId: string, currentStatus: "active" | "inactive") => {
    e.preventDefault(); // Prevent navigating to agent details
    e.stopPropagation(); // Prevent event bubbling
    
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toast({
      title: `Agent ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `The agent is now ${newStatus}.`,
    });
    
    // Here you would typically call an API to update the agent's status
    console.log(`Toggling agent ${agentId} to ${newStatus}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <CircleSlash className="h-16 w-16 text-agent-error opacity-80" />
        <h2 className="text-2xl font-semibold text-foreground dark:text-white">Error Loading Agents</h2>
        <p className="text-muted-foreground dark:text-gray-300">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground dark:text-white tracking-tight">{getFilterTitle()}</h1>
          <p className="text-muted-foreground dark:text-gray-300 mt-1">Manage and monitor your intelligent agents</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents..."
              className="pl-10 w-full md:w-64 dark:bg-[#000313]/70"
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
          <h2 className="text-2xl font-semibold text-foreground dark:text-white">No Agents Found</h2>
          <p className="text-muted-foreground dark:text-gray-300">
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
              <Card className="h-full card-hover bg-white dark:bg-[#000313]/80">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-800">
                        <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`} alt={agent.name} />
                        <AvatarFallback><UserCircle2 className="h-6 w-6" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground dark:text-white">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">{agent.type}</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={(e) => handleToggleStatus(e, agent.id, agent.status)}
                    >
                      {agent.status === "active" ? (
                        <ToggleRight className="h-6 w-6 text-agent-success" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    {agent.isPersonal && (
                      <Badge variant="outline" className="bg-agent-secondary text-agent-primary border-none mb-2">
                        Personal
                      </Badge>
                    )}
                    <CardDescription className="line-clamp-2 text-muted-foreground dark:text-gray-300">
                      {agent.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Created {agent.createdAt}</span>
                    <span>•</span>
                    <span>{agent.interactions} interactions</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
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
