import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Bot, Search, CircleSlash, Loader2, UserCircle2, MoreVertical, Power, Edit, Eye, Archive, AlertCircle, Star, MessageCircle, Calendar, Phone, Mail, Copy, Sparkles, PlusCircle, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AgentType, AgentStatus, AgentChannelConfig } from "@/types/agent";
import { useAgents } from "@/hooks/useAgents";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentChannels } from "@/components/AgentChannels";
import { AgentStats } from "@/components/AgentStats";

const randomNames = ["Aria", "Mike", "Yuki", "Misty", "Nova", "Zephyr", "Echo", "Luna", "Orion", "Iris"];

const getRandomName = (id: string) => {
  const lastChar = id.charAt(id.length - 1);
  const index = parseInt(lastChar, 36) % randomNames.length;
  return randomNames[index];
};

const getAgentAVMScore = (id: string): number => {
  const charSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseScore = 1 + (charSum % 9);
  const decimalPart = ((charSum * 13) % 100) / 100;
  return parseFloat((baseScore + decimalPart).toFixed(2));
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
  
  const newlyCreatedAgent: AgentType = {
    id: "new123",
    name: "New Agent",
    description: "This agent was just created and needs configuration to be fully operational.",
    purpose: "Help users with customer inquiries and provide assistance with common questions.",
    status: "inactive",
    type: "customer-support",
    createdAt: "Just now",
    interactions: 0,
    channelConfigs: {
      "web": { enabled: false },
      "email": { enabled: false },
      "voice": { enabled: false }
    }
  };
  
  const [sortBy, setSortBy] = useState<string>("recent");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (initialAgents) {
      let sorted = [newlyCreatedAgent, ...initialAgents];
      
      // Apply sorting
      sorted = [...sorted].sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "most-used":
            return (b.interactions || 0) - (a.interactions || 0);
          case "less-used":
            return (a.interactions || 0) - (b.interactions || 0);
          case "recent":
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      // Apply filters
      let filtered = sorted.filter(agent => {
        const nameMatch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
        const purposeMatch = agent.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const searchMatches = nameMatch || purposeMatch;

        const typeMatches = filterType === "all" || agent.type === filterType;
        const statusMatches = filterStatus === "all" || agent.status === filterStatus;
        const channelMatches = filterChannel === "all" || 
          (agent.channels && agent.channels.includes(filterChannel)) ||
          (agent.channelConfigs && agent.channelConfigs[filterChannel]?.enabled);

        return searchMatches && typeMatches && statusMatches && channelMatches;
      });

      setFilteredAgents(filtered);
    }
  }, [initialAgents, searchTerm, sortBy, filterType, filterChannel, filterStatus]);

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

  const executeToggleStatus = (agentId: string, currentStatus: AgentStatus) => {
    const newStatus: AgentStatus = currentStatus === "active" ? "inactive" : "active";
    
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

  const handleToggleStatus = (e: React.MouseEvent, agentId: string, currentStatus: AgentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleCancelDeactivation = () => {
    setConfirmDialogOpen(false);
    setAgentToDeactivate(null);
  };

  const handleEditAgent = (e: React.MouseEvent, agentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (agentId === "new123") {
      navigate(`/agents/${agentId}?tab=setup`);
    } else {
      navigate(`/agents/${agentId}?tab=settings`);
    }
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
    
    if (agentId === "new123") {
      navigate(`/agents/${agentId}?tab=setup`);
    } else {
      navigate(`/agents/${agentId}`);
    }
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied`,
      description: `The ${type.toLowerCase()} has been copied to clipboard.`,
    });
  };

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
    toast({
      title: "Calling Agent",
      description: `Initiating call to ${phone}`,
    });
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
            <AlertDialogCancel onClick={handleCancelDeactivation}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeactivation} className="bg-agent-primary">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <h1 className="text-3xl font-semibold text-foreground dark:text-white tracking-tight">
          {getFilterTitle()}
        </h1>
        <p className="text-muted-foreground dark:text-gray-300 mt-1">
          Manage and monitor your intelligent agents
        </p>
      </div>
      
      <Separator />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or purpose..."
            className="pl-10 w-full dark:bg-[#000313]/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Agent Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="customer-support">Customer Support</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="technical-support">Technical Support</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="voice">Voice</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-used">Most Used</SelectItem>
              <SelectItem value="less-used">Less Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          <Link to="/agents/create" className="block">
            <Card className="h-full card-hover border-dashed border-2 border-agent-primary/30 hover:border-agent-primary/70 transition-all bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/30">
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="h-12 w-12 rounded-full bg-agent-primary/10 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-agent-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground dark:text-white">Create New Agent</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400 text-center mt-2 max-w-xs">
                  Create a custom AI agent to help with customer support, sales, or other tasks
                </p>
              </div>
            </Card>
          </Link>
        
          {filteredAgents.slice(1).map((agent) => (
            <Link to={`/agents/${agent.id}`} key={agent.id} className="block">
              <Card className="h-full card-hover">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-800">
                        <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`} alt={agent.name} />
                        <AvatarFallback><UserCircle2 className="h-6 w-6" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground dark:text-white">{getRandomName(agent.id)}</h3>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">{agent.phone}</p>
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
                    <CardDescription className="line-clamp-2 text-muted-foreground dark:text-gray-300 mb-2">
                      {agent.description}
                    </CardDescription>
                    
                    {agent.channelConfigs ? (
                      <AgentChannels channels={agent.channelConfigs} readonly={true} compact={true} className="mt-0" />
                    ) : agent.channels && agent.channels.length > 0 ? (
                      <AgentChannels 
                        channels={agent.channels.reduce((obj, channel) => {
                          obj[channel] = { enabled: true };
                          return obj;
                        }, {} as Record<string, AgentChannelConfig>)} 
                        readonly={true} 
                        compact={true}
                        className="mt-0"
                      />
                    ) : null}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    {/* Show filtered attributes */}
                    {filterType !== "all" && (
                      <Badge variant="secondary" className="w-fit">
                        Type: {agent.type}
                      </Badge>
                    )}
                    {filterChannel !== "all" && agent.channels && (
                      <Badge variant="secondary" className="w-fit">
                        Channel: {filterChannel}
                      </Badge>
                    )}
                    {filterStatus !== "all" && (
                      <Badge variant="secondary" className="w-fit">
                        Status: {agent.status}
                      </Badge>
                    )}
                    
                    <AgentStats 
                      avmScore={getAgentAVMScore(agent.id)} 
                      interactionCount={agent.interactions}
                      compact={true}
                      hideInteractions={true}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <AgentToggle 
                    isActive={agent.status === "active"} 
                    onToggle={(e) => handleToggleStatus(e, agent.id, agent.status)} 
                  />
                  <div className="text-sm text-foreground dark:text-white font-medium">View Details &rarr;</div>
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
