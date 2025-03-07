import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Bot, Settings, Trash2, AlertCircle, Loader2, 
  ExternalLink, History, BarChart2, Cpu, Calendar, Check, X, Mic, Volume2 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AgentType } from "@/types/agent";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { AgentSetupStepper } from "@/components/AgentSetupStepper";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentChannels } from "@/components/AgentChannels";

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
    avmScore: 7.8,
    voiceProvider: agent.voiceProvider || "Eleven Labs",
    voice: agent.voice || "Emma"
  };
  
  const lastUpdated = new Date().toLocaleString();
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link to="/agents" className="flex items-center text-gray-500 hover:text-agent-primary transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Back to Agents</span>
        </Link>
      </div>
      
      <div className="rounded-xl bg-gradient-to-br from-agent-dark-bg/90 to-agent-dark-bg/70 backdrop-blur-sm border border-white/10 p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-agent-primary/5 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-start space-x-4">
              <div className="bg-agent-primary/20 p-3.5 rounded-full">
                <Bot className="h-7 w-7 text-agent-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                  <Badge 
                    variant="outline" 
                    className={`${isActive 
                      ? "border-green-500/30 text-green-500 bg-green-500/10" 
                      : "border-gray-500/30 text-gray-400 bg-gray-500/10"}`}
                  >
                    <span className="flex items-center gap-1">
                      {isActive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Online
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                          Offline
                        </>
                      )}
                    </span>
                  </Badge>
                </div>
                <p className="text-gray-300 mt-1 max-w-2xl">{agent.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Mic className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-sm text-gray-300">
                      <span className="font-medium text-white">{agentWithAvmScore.voice}</span> via 
                      <Badge variant="outline" className="ml-1.5 border-agent-primary/30 text-agent-primary bg-agent-primary/10">
                        {agentWithAvmScore.voiceProvider}
                      </Badge>
                    </span>
                  </div>
                  {agent.model && (
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5 text-agent-primary" />
                      <span className="text-sm text-gray-300">
                        <span className="font-medium text-white">{agent.model}</span>
                      </span>
                    </div>
                  )}
                  {agent.channels && agent.channels.length > 0 && (
                    <AgentChannels channels={agent.channels} />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-2 md:mt-0">
              <AgentToggle isActive={isActive} onToggle={handleStatusToggle} />
              <Button variant="outline" className="space-x-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete} 
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg border border-white/10 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">AVM Score</span>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-white">{agentWithAvmScore.avmScore.toFixed(1)}</span>
                <span className="text-xs text-gray-400 ml-1">/10</span>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg border border-white/10 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">Interactions</span>
                <span className="text-xs font-medium text-yellow-500">Gold</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {agent.interactions >= 1000 
                  ? `${(agent.interactions / 1000).toFixed(1)}k` 
                  : agent.interactions}
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg border border-white/10 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">Performance</span>
                <span className="text-xs text-agent-success">+2%</span>
              </div>
              <div className="text-2xl font-bold text-white">94%</div>
            </div>
            
            <div className="bg-black/30 rounded-lg border border-white/10 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">Last Updated</span>
                <Calendar className="h-3 w-3 text-gray-500" />
              </div>
              <div className="text-sm font-medium text-white truncate">{lastUpdated}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-agent-dark-bg border-gray-800 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="space-y-1">
                <div className="text-xs uppercase text-gray-500 font-medium">Type</div>
                <div className="text-sm font-medium text-white flex items-center">
                  <Bot className="h-3.5 w-3.5 mr-1.5 text-agent-primary" />
                  {agent.type}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs uppercase text-gray-500 font-medium">Created On</div>
                <div className="text-sm font-medium text-white flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-agent-primary" />
                  {agent.createdAt}
                </div>
              </div>
              
              <div className="space-y-1 col-span-2">
                <div className="text-xs uppercase text-gray-500 font-medium">Available Channels</div>
                <div className="text-sm font-medium text-white">
                  {agent.channels && agent.channels.length > 0 ? (
                    <AgentChannels channels={agent.channels} />
                  ) : (
                    <span className="text-gray-400 text-sm">No channels configured</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-agent-dark-bg border-gray-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="flex flex-col items-center justify-center h-auto py-3 px-2 bg-black/50 border-gray-700 hover:bg-black/70 hover:border-agent-primary/50 group">
              <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-agent-primary/10 group-hover:bg-agent-primary/20 transition-colors">
                <ExternalLink className="h-4 w-4 text-agent-primary" />
              </div>
              <div className="text-center">
                <div className="font-medium text-white text-sm">Test Agent</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center justify-center h-auto py-3 px-2 bg-black/50 border-gray-700 hover:bg-black/70 hover:border-agent-primary/50 group">
              <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-agent-primary/10 group-hover:bg-agent-primary/20 transition-colors">
                <History className="h-4 w-4 text-agent-primary" />
              </div>
              <div className="text-center">
                <div className="font-medium text-white text-sm">View Logs</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center justify-center h-auto py-3 px-2 bg-black/50 border-gray-700 hover:bg-black/70 hover:border-agent-primary/50 group">
              <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-agent-primary/10 group-hover:bg-agent-primary/20 transition-colors">
                <ExternalLink className="h-4 w-4 text-agent-primary" />
              </div>
              <div className="text-center">
                <div className="font-medium text-white text-sm">Integration</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center justify-center h-auto py-3 px-2 bg-black/50 border-gray-700 hover:bg-black/70 hover:border-agent-primary/50 group">
              <div className="w-8 h-8 mb-2 flex items-center justify-center rounded-full bg-agent-primary/10 group-hover:bg-agent-primary/20 transition-colors">
                <Settings className="h-4 w-4 text-agent-primary" />
              </div>
              <div className="text-center">
                <div className="font-medium text-white text-sm">Configure</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6 bg-gray-800" />
      
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[400px] bg-agent-dark-bg/50 border border-gray-800">
          <TabsTrigger value="setup" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
            Setup
          </TabsTrigger>
          <TabsTrigger value="overview" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="animate-fade-in">
          <AgentSetupStepper agent={agentWithAvmScore} />
        </TabsContent>
        
        <TabsContent value="overview" className="animate-fade-in">
          <div className="text-center text-gray-400 py-10">
            <BarChart2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <p className="max-w-lg mx-auto">
              All essential agent information has been moved to the main view for easy access.
              <br />
              Select the Analytics tab to view detailed performance metrics.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <Card className="bg-agent-dark-bg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Analytics</CardTitle>
              <CardDescription className="text-gray-400">View detailed agent performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="h-16 w-16 text-agent-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">Analytics Dashboard</h3>
                <p className="text-gray-400 max-w-md">
                  Detailed performance metrics will be displayed here, including response times,
                  success rates, and usage patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <Card className="bg-agent-dark-bg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Agent Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure your agent's behavior and capabilities</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Settings className="h-16 w-16 text-agent-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">Settings Panel</h3>
                <p className="text-gray-400 max-w-md">
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
