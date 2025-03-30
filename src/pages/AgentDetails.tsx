
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgentStats } from "@/components/AgentStats";
import { AgentChannels } from "@/components/AgentChannels";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentConfigSettings } from "@/components/AgentConfigSettings";
import { AgentSetupStepper } from "@/components/AgentSetupStepper";
import { useToast } from "@/hooks/use-toast";
import { getAgentById, toggleAgentActive, updateAgent, deleteAgent } from "@/services/agentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, ArrowLeft, Settings, MessageSquare, LineChart, Trash2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch agent data
  const { 
    data: agent, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => getAgentById(agentId || ''),
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Agent with id')) {
        return false;
      }
      return failureCount < 3;
    }
  });

  // Mutations
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      toggleAgentActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: (updates: any) => updateAgent(agentId || '', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (id: string) => deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      navigate('/agents');
      toast({
        title: "Agent deleted",
        description: "The agent has been permanently deleted."
      });
    },
    onError: (error) => {
      console.error("Error deleting agent:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the agent. Please try again.",
        variant: "destructive"
      });
      setIsDeleting(false);
    }
  });

  const handleToggleActive = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!agent) return;

    toggleActiveMutation.mutate({ 
      id: agent.id, 
      isActive: !agent.isActive 
    });

    toast({
      title: agent.isActive ? "Agent deactivated" : "Agent activated",
      description: agent.isActive 
        ? "The agent has been deactivated and will no longer respond to new requests."
        : "The agent has been activated and will now respond to requests."
    });
  };

  const handleAgentUpdate = (updatedAgent: any) => {
    // The update is handled automatically in the AgentConfigSettings component
  };

  const handleDeleteAgent = () => {
    if (!agent) return;
    setIsDeleting(true);
    deleteAgentMutation.mutate(agent.id);
  };

  const handleBackClick = () => {
    navigate('/agents');
  };

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading agent details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Button>
        
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Failed to load agent details. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="outline" 
        onClick={handleBackClick}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Agents
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>
              <Bot className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <p className="text-muted-foreground">{agent.description || 'No description'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <AgentToggle 
            isActive={agent.isActive} 
            onToggle={handleToggleActive} 
          />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this agent?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the agent "{agent.name}" and all associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAgent}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Agent"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-6">
        <AgentChannels 
          channels={agent.channelConfigs} 
          readonly 
          showDetails
        />
        
        <div className="hidden md:block ml-auto">
          <AgentStats
            avmScore={agent.avmScore}
            interactionCount={agent.interactionCount}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <Bot className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <LineChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <AgentSetupStepper agent={agent} />
        </TabsContent>
        
        <TabsContent value="settings">
          <AgentConfigSettings 
            agent={agent} 
            onAgentUpdate={handleAgentUpdate}
            showSuccessToast={showSuccessToast}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Agent Analytics</h2>
              <div className="bg-muted p-12 rounded-lg flex flex-col items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <p className="text-muted-foreground text-lg">Analytics dashboard coming soon</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetails;
