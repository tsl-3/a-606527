import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Bot, Search, CircleSlash, Loader2, UserCircle2, MoreVertical, Power, Edit, Eye, Archive, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { AgentType } from "@/types/agent";
import { useAgents } from "@/hooks/useAgents";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentChannels } from "@/components/AgentChannels";

const randomNames = ["Aria", "Mike", "Yuki", "Misty", "Nova", "Zephyr", "Echo", "Luna", "Orion", "Iris"];

const getRandomName = (id: string) => {
  const lastChar = id.charAt(id.length - 1);
  const index = parseInt(lastChar, 36) % randomNames.length;
  return randomNames[index];
};

const AgentsDashboard = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const filter = searchParams.get("filter") || "all-agents";
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [agentToDeactivate, setAgentToDeactivate] = useState<string | null>(null);
  const [skipConfirmation, setSkipConfirmation] = useState(() => {
    const saved = localStorage.getItem("skipAgentDeactivationConfirmation");
    return saved === "true";
  });
  
  const { agents: initialAgents, isLoading, error } = useAgents(filter);
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentType[]>([]);
  
  useEffect(() => {
    if (initialAgents) {
      setAgents(initialAgents);
      setFilteredAgents(
        initialAgents.filter(agent => 
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [initialAgents, searchTerm]);

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

  const executeToggleStatus = (agentId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    );
    
    setFilteredAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    );
    
    toast({
      title: `Agent ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `The agent is now ${newStatus}.`,
    });
    
    console.log(`Toggling agent ${agentId} to ${newStatus}`);
  };

  const handleToggleStatus = (e: React.MouseEvent, agentId: string, currentStatus: "active" | "inactive") => {
    e.preventDefault(); // Prevent navigating to agent details
    e.stopPropagation(); // Prevent event bubbling
    
    if (currentStatus === "inactive" || skipConfirmation) {
      executeToggleStatus(agentId, currentStatus);
      return;
    }
    
    setAgentToDeactivate(agentId);
    setConfirmDialogOpen(true);
  };
  
  const handleSkipConfirmationChange = (checked: boolean) => {
    setSkipConfirmation(checked);
    localStorage.setItem("skipAgentDeactivationConfirmation", checked.toString());
  };
  
  const handleConfirmDeactivation = () => {
    if (agentToDeactivate) {
      const agent = agents.find(a => a.id === agentToDeactivate);
      if (agent) {
        executeToggleStatus(agentToDeactivate, agent.status);
      }
    }
    
    setConfirmDialogOpen(false);
    setAgentToDeactivate(null);
  };

  const handleEditAgent = (e: React.MouseEvent, agentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Edit Agent",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleArchiveAgent = (e: React.MouseEvent, agentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Archive Agent",
      description: "The agent has been archived.",
      variant: "destructive",
    });
    setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
    setFilteredAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
  };

  const handleViewDetails = (e: React.MouseEvent, agentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/agents/${agentId}`);
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
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Deactivate Agent?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this agent? It will no longer respond to user queries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-3">
            <Checkbox
              id="skipConfirmation"
              checked={skipConfirmation}
              onCheckedChange={handleSkipConfirmationChange}
            />
            <label
              htmlFor="skipConfirmation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't ask me again
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeactivation} className="bg-agent-primary">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                        <h3 className="font-medium text-foreground dark:text-white">{getRandomName(agent.id)}</h3>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">{agent.name}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-900 z-50">
                        <DropdownMenuItem onClick={(e) => handleToggleStatus(e, agent.id, agent.status)}>
                          <Power className="mr-2 h-4 w-4" />
                          {agent.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleEditAgent(e, agent.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleViewDetails(e, agent.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleArchiveAgent(e, agent.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-3">
                    <CardDescription className="line-clamp-2 text-muted-foreground dark:text-gray-300">
                      {agent.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>Created {agent.createdAt}</span>
                      <span>•</span>
                      <span>{agent.interactions} interactions</span>
                    </div>
                    <AgentChannels channels={agent.channels} />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <AgentToggle 
                    isActive={agent.status === "active"} 
                    onToggle={(e) => handleToggleStatus(e, agent.id, agent.status)} 
                  />
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
