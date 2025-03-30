
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bot, Mic, FileText, ArrowLeft, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentConfigSidebar } from "@/components/AgentConfigSidebar";
import { useToast } from "@/hooks/use-toast";
import { createAgent } from "@/services/agentService";
import AgentConfigSettings from "@/components/AgentConfigSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgentCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [creationMethod, setCreationMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agentConfig, setAgentConfig] = useState({
    name: "",
    description: "",
    purpose: "",
    prompt: "",
    industry: "",
    botFunction: "",
    customIndustry: "",
    customFunction: "",
    model: "GPT-4",
    agentType: ""
  });

  const handleBackClick = () => {
    navigate('/agents');
  };

  const handleCreateAgent = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Ensure we have at least a name
      const agentName = agentConfig.name || "New Agent";
      
      console.log('Starting agent creation with config:', {
        ...agentConfig,
        name: agentName
      });
      
      // Create new agent with basic info
      const newAgent = await createAgent({
        name: agentName,
        description: agentConfig.description,
        purpose: agentConfig.purpose,
        prompt: agentConfig.prompt,
        industry: agentConfig.industry === 'other' ? '' : agentConfig.industry,
        botFunction: agentConfig.botFunction === 'other' ? '' : agentConfig.botFunction,
        customIndustry: agentConfig.industry === 'other' ? agentConfig.customIndustry : '',
        customFunction: agentConfig.botFunction === 'other' ? agentConfig.customFunction : '',
        model: agentConfig.model,
        isActive: false
      });
      
      console.log('Agent created successfully:', newAgent);
      
      toast({
        title: "Agent created successfully",
        description: `${newAgent.name} has been added to your agents.`
      });
      
      // Navigate to the agent details page
      navigate(`/agents/${newAgent.id}`);
    } catch (err: any) {
      console.error("Error creating agent:", err);
      setError(err.message || "There was an error creating your agent");
      toast({
        title: "Failed to create agent",
        description: err.message || "There was an error creating your agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setAgentConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleUpdateAgent = (updatedAgent: any) => {
    setAgentConfig({
      name: updatedAgent.name,
      description: updatedAgent.description || "",
      purpose: updatedAgent.purpose || "",
      prompt: updatedAgent.prompt || "",
      industry: updatedAgent.industry || "",
      botFunction: updatedAgent.botFunction || "",
      customIndustry: updatedAgent.customIndustry || "",
      customFunction: updatedAgent.customFunction || "",
      model: updatedAgent.model || "GPT-4",
      agentType: ""
    });
  };
  
  const renderCreationMethod = () => {
    if (!creationMethod) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
          <Card 
            className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary"
            onClick={() => setCreationMethod('voice')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <Mic className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="mt-4">Voice Creation</CardTitle>
              <CardDescription>
                Use voice commands to set up your agent by answering a series of prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Button variant="outline">Start Voice Setup</Button>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary"
            onClick={() => setCreationMethod('manual')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="mt-4">Manual Creation</CardTitle>
              <CardDescription>
                Configure your agent manually by filling out the required fields
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Button variant="outline">Start Manual Setup</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (creationMethod === 'voice') {
      return (
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Voice-Guided Setup</CardTitle>
              <CardDescription>
                Follow the voice prompts to set up your agent. You can say "skip" to move to the next question.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-center py-12">
                <div className="mx-auto bg-primary/10 p-8 rounded-full w-32 h-32 flex items-center justify-center mb-6">
                  <Mic className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Voice setup coming soon</h3>
                <p className="text-muted-foreground mb-6">
                  This feature is under development. Please use manual setup for now.
                </p>
                <Button onClick={() => setCreationMethod('manual')}>
                  Switch to Manual Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="col-span-1 hidden lg:block">
          <AgentConfigSidebar agentConfig={agentConfig} />
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="basics" className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <AgentConfigSettings 
                agent={{
                  id: 'new123',
                  name: agentConfig.name,
                  description: agentConfig.description,
                  purpose: agentConfig.purpose,
                  prompt: agentConfig.prompt,
                  industry: agentConfig.industry,
                  botFunction: agentConfig.botFunction,
                  model: agentConfig.model,
                  customIndustry: agentConfig.customIndustry,
                  customFunction: agentConfig.customFunction,
                  isActive: false,
                  channels: [],
                  channelConfigs: {},
                  interactionCount: 0,
                }}
                onAgentUpdate={handleUpdateAgent}
              />
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced settings for your agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground py-12 text-center">
                    Advanced settings will be available after creating the agent.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Card className="mt-4 border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBackClick}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Agents
            </Button>
            
            <Button 
              onClick={handleCreateAgent} 
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <span className="animate-pulse">Creating...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Agent
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Create New ENSPYR AI Agent</h1>
      </div>
      
      {renderCreationMethod()}
    </div>
  );
};

export default AgentCreate;
