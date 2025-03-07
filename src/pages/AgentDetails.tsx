import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Settings, Trash2, AlertCircle, Loader2, ExternalLink, History, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AgentType } from "@/types/agent";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { AgentSetupStepper } from "@/components/AgentSetupStepper";
import { AgentStats } from "@/components/AgentStats";

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agent, isLoading, error } = useAgentDetails(agentId);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (agent) {
      setIsActive(agent.status === "active");
    }
  }, [agent]);
  
  const handleStatusToggle = () => {
    setIsActive(!isActive);
    toast({
      title: !isActive ? "Agent Activated" : "Agent Deactivated",
      description: !isActive 
        ? "Your agent is now active and will process requests."
        : "Your agent has been deactivated and won't process new requests.",
      variant: !isActive ? "default" : "destructive",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Agent deleted",
      description: "The agent has been successfully deleted.",
      variant: "destructive",
    });
    navigate("/agents");
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 text-agent-primary animate-spin" />
      </div>
    );
  }
  
  if (error || !agent) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/agents" className="flex items-center text-gray-500 hover:text-agent-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Link>
        </div>
        
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "This agent could not be found or you don't have permission to view it."}
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate("/agents")}>Return to Dashboard</Button>
      </div>
    );
  }

  const agentWithAvmScore = {
    ...agent,
    avmScore: 7.8 // Example score, in a real app this would come from the API
  };
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <Link to="/agents" className="flex items-center text-gray-500 hover:text-agent-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="bg-agent-primary/10 p-3 rounded-full">
            <Bot className="h-8 w-8 text-agent-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-semibold text-agent-dark dark:text-white">{agent.name}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-300 mt-1">{agent.description}</p>
            <div className="mt-3">
              <AgentStats avmScore={agentWithAvmScore.avmScore} interactionCount={agent.interactions} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isActive} 
              onCheckedChange={handleStatusToggle} 
              className="data-[state=checked]:bg-agent-success"
            />
            <span className="text-sm font-medium">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <Button variant="outline" className="space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
            <CardDescription>Agent current state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-agent-success animate-pulse' : 'bg-gray-300'}`} />
              <span className="font-medium">{isActive ? "Online" : "Offline"}</span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactions</CardTitle>
            <CardDescription>Total agent interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agent-dark">{agent.interactions}</div>
            <div className="text-sm text-agent-success mt-1">+24% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>Response effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agent-dark">94%</div>
            <div className="text-sm text-agent-success mt-1">+2% from last week</div>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="animate-fade-in">
          <AgentSetupStepper agent={agentWithAvmScore} />
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Type</div>
                  <div className="col-span-2 font-medium">{agent.type}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Created On</div>
                  <div className="col-span-2 font-medium">{agent.createdAt}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Model</div>
                  <div className="col-span-2 font-medium">{agent.model || "GPT-4"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Access</div>
                  <div className="col-span-2 font-medium">{agent.isPersonal ? "Personal" : "Team"}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center space-x-2 justify-start h-auto py-3">
                  <ExternalLink className="h-4 w-4 text-agent-primary" />
                  <div className="text-left">
                    <div className="font-medium">Test Agent</div>
                    <div className="text-xs text-gray-500">Try agent in sandbox</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2 justify-start h-auto py-3">
                  <History className="h-4 w-4 text-agent-primary" />
                  <div className="text-left">
                    <div className="font-medium">View Logs</div>
                    <div className="text-xs text-gray-500">See recent interactions</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2 justify-start h-auto py-3">
                  <ExternalLink className="h-4 w-4 text-agent-primary" />
                  <div className="text-left">
                    <div className="font-medium">Integration</div>
                    <div className="text-xs text-gray-500">Add to your apps</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2 justify-start h-auto py-3">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <div className="text-left">
                    <div className="font-medium">Configure</div>
                    <div className="text-xs text-gray-500">Modify settings</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>View detailed agent performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="h-16 w-16 text-agent-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-gray-500 max-w-md">
                  Detailed performance metrics will be displayed here, including response times,
                  success rates, and usage patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Agent Settings</CardTitle>
              <CardDescription>Configure your agent's behavior and capabilities</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Settings className="h-16 w-16 text-agent-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Settings Panel</h3>
                <p className="text-gray-500 max-w-md">
                  Agent configuration options will be displayed here, including model settings,
                  knowledge base connections, and response parameters.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetails;
