
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgents, toggleAgentActive } from "@/services/agentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentStats } from "@/components/AgentStats";
import { AgentChannels } from "@/components/AgentChannels";
import { useToast } from "@/hooks/use-toast";
import { Bot, Search, Plus, ArrowRight, BarChart, Users, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const AgentsDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [tabValue, setTabValue] = useState("all");

  // Fetch agents
  const { data: agents, isLoading, isError } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents
  });

  // Toggle agent active status
  const toggleAgentMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      toggleAgentActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleAgentMutation.mutate({ 
      id, 
      isActive: !currentStatus 
    });

    toast({
      title: currentStatus ? "Agent deactivated" : "Agent activated",
      description: currentStatus 
        ? "The agent has been deactivated and will no longer respond to new requests."
        : "The agent has been activated and will now respond to requests."
    });
  };

  const handleCreateAgentClick = () => {
    navigate('/agents/create');
  };

  const handleAgentClick = (id: string) => {
    navigate(`/agents/${id}`);
  };

  // Filter and search logic
  const filteredAgents = agents?.filter(agent => {
    const matchesSearch = searchQuery === "" || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (tabValue === "all") return matchesSearch;
    if (tabValue === "active") return matchesSearch && agent.isActive;
    if (tabValue === "inactive") return matchesSearch && !agent.isActive;
    
    return matchesSearch;
  }) || [];

  const industryFilteredAgents = filterType === "all" 
    ? filteredAgents 
    : filteredAgents.filter(agent => agent.industry === filterType);

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          Error loading agents. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Your Agents
          </h1>
          <p className="text-muted-foreground">
            Manage your AI agents
          </p>
        </div>
        
        <Button onClick={handleCreateAgentClick} className="gap-2">
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Users className="h-4 w-4" />
            All Agents
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <BarChart className="h-4 w-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" className="gap-2">
            <Bot className="h-4 w-4" />
            Inactive
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <AgentListSkeleton />
          ) : industryFilteredAgents.length > 0 ? (
            <div className="space-y-4">
              {industryFilteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onToggleActive={(e) => {
                    e.stopPropagation();
                    handleToggleActive(agent.id, agent.isActive);
                  }}
                  onClick={() => handleAgentClick(agent.id)}
                />
              ))}
            </div>
          ) : (
            <NoAgentsFound searchQuery={searchQuery} filterType={filterType} />
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <AgentListSkeleton />
          ) : industryFilteredAgents.filter(a => a.isActive).length > 0 ? (
            <div className="space-y-4">
              {industryFilteredAgents
                .filter(agent => agent.isActive)
                .map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onToggleActive={(e) => {
                      e.stopPropagation();
                      handleToggleActive(agent.id, agent.isActive);
                    }}
                    onClick={() => handleAgentClick(agent.id)}
                  />
                ))}
            </div>
          ) : (
            <NoAgentsFound activeOnly searchQuery={searchQuery} filterType={filterType} />
          )}
        </TabsContent>
        
        <TabsContent value="inactive" className="space-y-4">
          {isLoading ? (
            <AgentListSkeleton />
          ) : industryFilteredAgents.filter(a => !a.isActive).length > 0 ? (
            <div className="space-y-4">
              {industryFilteredAgents
                .filter(agent => !agent.isActive)
                .map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onToggleActive={(e) => {
                      e.stopPropagation();
                      handleToggleActive(agent.id, agent.isActive);
                    }}
                    onClick={() => handleAgentClick(agent.id)}
                  />
                ))}
            </div>
          ) : (
            <NoAgentsFound inactiveOnly searchQuery={searchQuery} filterType={filterType} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Agent Card Component
interface AgentCardProps {
  agent: any;
  onToggleActive: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onToggleActive, onClick }) => {
  return (
    <div 
      className="bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className="text-muted-foreground text-sm">{agent.description || 'No description'}</p>
            
            <div className="mt-2">
              <AgentChannels 
                channels={agent.channelConfigs} 
                readonly 
                compact 
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <AgentToggle isActive={agent.isActive} onToggle={onToggleActive} />
          
          <div className="mt-2">
            <AgentStats
              avmScore={agent.avmScore}
              interactionCount={agent.interactionCount}
              compact
              hideInteractions
            />
          </div>
          
          <Button variant="ghost" size="sm" className="gap-1 mt-2">
            <span className="text-xs">View</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for agents list
const AgentListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16 mt-2" />
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// No agents found component
interface NoAgentsFoundProps {
  searchQuery?: string;
  filterType?: string;
  activeOnly?: boolean;
  inactiveOnly?: boolean;
}

const NoAgentsFound: React.FC<NoAgentsFoundProps> = ({ 
  searchQuery, 
  filterType, 
  activeOnly,
  inactiveOnly
}) => {
  const navigate = useNavigate();
  
  const getMessage = () => {
    if (searchQuery) {
      return `No agents found matching "${searchQuery}"`;
    }
    
    if (filterType && filterType !== "all") {
      if (activeOnly) {
        return `No active agents found in the ${filterType} industry`;
      }
      if (inactiveOnly) {
        return `No inactive agents found in the ${filterType} industry`;
      }
      return `No agents found in the ${filterType} industry`;
    }
    
    if (activeOnly) {
      return "No active agents found";
    }
    
    if (inactiveOnly) {
      return "No inactive agents found";
    }
    
    return "No agents found";
  };
  
  return (
    <div className="bg-card border rounded-lg p-8 text-center">
      <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{getMessage()}</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery || filterType !== "all" 
          ? "Try adjusting your search or filter criteria" 
          : "Create your first agent to get started"}
      </p>
      <Button onClick={() => navigate('/agents/create')}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Agent
      </Button>
    </div>
  );
};

export default AgentsDashboard;
