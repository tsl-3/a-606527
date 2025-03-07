import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Bot, Settings, Trash2, AlertCircle, Loader2, 
  ExternalLink, History, BarChart2, Cpu, Calendar, Mic, Volume2, MessageSquare, Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { AgentType } from "@/types/agent";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { AgentSetupStepper } from "@/components/AgentSetupStepper";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentChannels } from "@/components/AgentChannels";
import { AgentStats } from "@/components/AgentStats";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateAgent } from "@/services/agentService";

const SAMPLE_TEXT = "Hello, I'm an AI assistant and I'm here to help you with your questions.";

const voiceSamples = {
  "Eleven Labs": {
    "Emma": "/voices/eleven-emma.mp3", 
    "Josh": "/voices/eleven-josh.mp3",
    "Aria": "/voices/eleven-aria.mp3",
    "Charlie": "/voices/eleven-charlie.mp3",
    "Custom": "" // No sample for custom voice
  },
  "Amazon Polly": {
    "Joanna": "/voices/polly-joanna.mp3",
    "Matthew": "/voices/polly-matthew.mp3"
  },
  "Google TTS": {
    "Wavenet A": "/voices/google-wavenet-a.mp3",
    "Wavenet B": "/voices/google-wavenet-b.mp3"
  }
};

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agent, isLoading, error } = useAgentDetails(agentId);
  const [isActive, setIsActive] = useState(false);
  const [model, setModel] = useState<string>("GPT-4");
  const [voice, setVoice] = useState<string>("Emma");
  const [voiceProvider, setVoiceProvider] = useState<string>("Eleven Labs");
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const [customVoiceId, setCustomVoiceId] = useState<string>("");
  const [isCustomVoice, setIsCustomVoice] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (agent) {
      setIsActive(agent.status === "active");
      setModel(agent.model || "GPT-4");
      setVoice(agent.voice || "Emma");
      setVoiceProvider(agent.voiceProvider || "Eleven Labs");
      setCustomVoiceId(agent.customVoiceId || "");
      setIsCustomVoice(agent.voice === "Custom");
    }
  }, [agent]);
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);
  
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
  
  const handleModelChange = async (value: string) => {
    setModel(value);
    if (agent && agentId) {
      try {
        await updateAgent(agentId, { ...agent, model: value });
        toast({
          title: "Model updated",
          description: `The agent model has been updated to ${value}.`,
        });
      } catch (error) {
        toast({
          title: "Failed to update model",
          description: "There was an error updating the agent model.",
          variant: "destructive",
        });
      }
    }
  };

  const handleVoiceChange = async (value: string) => {
    setVoice(value);
    setIsCustomVoice(value === "Custom");
    if (value !== "Custom" && currentlyPlaying !== value) {
      handlePlaySample(value);
    }
  };

  const handleProviderChange = async (value: string) => {
    setVoiceProvider(value);
    const voices = Object.keys(voiceSamples[value as keyof typeof voiceSamples] || {});
    if (voices.length > 0) {
      setVoice(voices[0]);
      setIsCustomVoice(voices[0] === "Custom");
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
  };

  const handleCustomVoiceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomVoiceId(e.target.value);
  };

  const handlePlaySample = (voiceName: string) => {
    if (currentlyPlaying === voiceName) {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
      return;
    }
    
    const voicePath = voiceSamples[voiceProvider as keyof typeof voiceSamples]?.[voiceName as any];
    
    if (!voicePath) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(voicePath);
    audioRef.current = audio;
    
    audio.onended = () => {
      setCurrentlyPlaying(null);
    };
    
    audio.onplay = () => {
      setCurrentlyPlaying(voiceName);
    };
    
    audio.onerror = () => {
      toast({
        title: "Audio Error",
        description: `Could not play sample for ${voiceName}.`,
        variant: "destructive",
      });
      setCurrentlyPlaying(null);
    };
    
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      setCurrentlyPlaying(null);
    });
  };

  const handleVoiceSelectionSave = async () => {
    if (agent && agentId) {
      try {
        const updatedAgent = { 
          ...agent, 
          voice: isCustomVoice ? "Custom" : voice,
          voiceProvider: voiceProvider,
          customVoiceId: isCustomVoice ? customVoiceId : undefined
        };
        
        await updateAgent(agentId, updatedAgent);
        toast({
          title: "Voice settings updated",
          description: `The voice settings have been updated.`,
        });
        setIsVoiceDialogOpen(false);
      } catch (error) {
        toast({
          title: "Failed to update voice settings",
          description: "There was an error updating the voice settings.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDelete = () => {
    toast({
      title: "Agent deleted",
      description: "The agent has been successfully deleted.",
      variant: "destructive",
    });
    navigate("/agents");
  };
  
  const handleUpdateChannel = async (channel: string, config: { enabled: boolean; details?: string; config?: Record<string, any> }) => {
    if (!agent || !agentId) return;
    
    let updatedChannels: string[] = [...(agent.channels || [])];
    
    if (config.enabled && !updatedChannels.includes(channel)) {
      updatedChannels.push(channel);
    } else if (!config.enabled && updatedChannels.includes(channel)) {
      updatedChannels = updatedChannels.filter(c => c !== channel);
    }
    
    try {
      const updatedAgent = { 
        ...agent,
        channels: updatedChannels,
        channelConfigs: {
          ...(agent.channelConfigs || {}),
          [channel]: config
        }
      };
      
      await updateAgent(agentId, updatedAgent);
      
      setIsActive(updatedAgent.status === "active");
      
      toast({
        title: config.enabled ? "Channel enabled" : "Channel disabled",
        description: `The ${channel} channel has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Failed to update channel",
        description: "There was an error updating the channel configuration.",
        variant: "destructive",
      });
    }
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
    voiceProvider: voiceProvider,
    voice: voice,
    model: model,
    channelConfigs: agent.channelConfigs || {},
    onUpdateChannel: handleUpdateChannel
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
      
      <Card className="bg-agent-dark-bg border-gray-800 mb-6 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-agent-primary/20 p-3 rounded-full">
                <Bot className="h-6 w-6 text-agent-primary" />
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
                    <span className="flex items-center gap-1.5">
                      {isActive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Active
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                          Inactive
                        </>
                      )}
                    </span>
                  </Badge>
                </div>
                <p className="text-gray-300 mt-1.5 max-w-2xl">{agent.description}</p>
                <AgentChannels 
                  channels={agent.channelConfigs || {}} 
                  readonly={true}
                  compact={true}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-2 md:mt-0">
              <AgentToggle isActive={isActive} onToggle={handleStatusToggle} />
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete} 
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-black/30 px-4 py-3 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-3.5 w-3.5 text-agent-primary" />
                      <span className="text-xs text-gray-400">Type</span>
                    </div>
                    <p className="text-sm font-medium text-white capitalize">{agent.type}</p>
                  </div>
                
                  <div className="bg-black/30 px-4 py-3 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-agent-primary" />
                      <span className="text-xs text-gray-400">Created On</span>
                    </div>
                    <p className="text-sm font-medium text-white">{agent.createdAt}</p>
                  </div>
                  
                  <div className="bg-black/30 px-4 py-3 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <History className="h-3.5 w-3.5 text-agent-primary" />
                      <span className="text-xs text-gray-400">Updated</span>
                    </div>
                    <p className="text-sm font-medium text-white">{lastUpdated.split(',')[0]}</p>
                  </div>

                  <div className="bg-black/30 px-4 py-3 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="h-3.5 w-3.5 text-agent-primary" />
                      <span className="text-xs text-gray-400">Model</span>
                    </div>
                    <Select value={model} onValueChange={handleModelChange}>
                      <SelectTrigger className="h-7 w-full bg-black/20 border-gray-700/50 text-white">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border-gray-700">
                        <SelectItem value="GPT-4">GPT-4</SelectItem>
                        <SelectItem value="GPT-3.5 Turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="Claude-2">Claude-2</SelectItem>
                        <SelectItem value="LLama-2">LLama-2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-black/30 px-4 py-3 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="h-3.5 w-3.5 text-agent-primary" />
                      <span className="text-xs text-gray-400">Voice</span>
                    </div>
                    <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 w-full bg-black/20 border-gray-700/50 text-white justify-between">
                          <span className="truncate">
                            {isCustomVoice ? `Custom (${customVoiceId.substring(0, 6)}...)` : `${voice} (${voiceProvider})`}
                          </span>
                          <span className="sr-only">Edit voice</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-black text-white border-gray-700">
                        <DialogHeader>
                          <DialogTitle>Configure Voice</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Select a voice provider and voice for your agent, or enter a custom voice ID
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue={voiceProvider} className="w-full" onValueChange={handleProviderChange}>
                          <TabsList className="w-full grid grid-cols-3 bg-black/30 border border-gray-800">
                            <TabsTrigger value="Eleven Labs" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
                              Eleven Labs
                            </TabsTrigger>
                            <TabsTrigger value="Amazon Polly" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
                              Amazon Polly
                            </TabsTrigger>
                            <TabsTrigger value="Google TTS" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
                              Google TTS
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="Eleven Labs" className="border-none p-0 mt-4">
                            <div className="space-y-4">
                              <RadioGroup value={voice} onValueChange={handleVoiceChange} className="grid grid-cols-2 gap-4">
                                {Object.keys(voiceSamples["Eleven Labs"]).map((voiceName) => (
                                  voiceName !== "Custom" ? (
                                    <div key={voiceName} className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
                                      <RadioGroupItem value={voiceName} id={`eleven-${voiceName.toLowerCase()}`} />
                                      <Label htmlFor={`eleven-${voiceName.toLowerCase()}`} className="font-medium cursor-pointer flex-1">{voiceName}</Label>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className={`h-6 ${currentlyPlaying === voiceName ? 'bg-agent-primary border-agent-primary text-white' : 'bg-black/20 border-gray-700'} text-xs`}
                                        onClick={() => handlePlaySample(voiceName)}
                                      >
                                        {currentlyPlaying === voiceName ? 'Stop' : 'Preview'}
                                      </Button>
                                    </div>
                                  ) : null
                                ))}
                                
                                <div className="col-span-2 flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
                                  <RadioGroupItem value="Custom" id="eleven-custom" />
                                  <Label htmlFor="eleven-custom" className="font-medium cursor-pointer flex-1">Custom Voice ID</Label>
                                  <Plus className="w-4 h-4 text-agent-primary" />
                                </div>
                                
                                {isCustomVoice && (
                                  <div className="col-span-2 p-3 rounded-md border border-gray-700 bg-black/20">
                                    <Label htmlFor="custom-voice-id" className="text-xs mb-2 block text-gray-400">
                                      Enter Eleven Labs Voice ID
                                    </Label>
                                    <Input
                                      id="custom-voice-id"
                                      value={customVoiceId}
                                      onChange={handleCustomVoiceIdChange}
                                      placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                                      className="bg-black/30 border-gray-700 text-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                      You can find your voice IDs in the Eleven Labs dashboard. 
                                      <a href="https://elevenlabs.io/app" target="_blank" rel="noopener noreferrer" className="text-agent-primary ml-1 hover:underline">
                                        Visit Eleven Labs
                                      </a>
                                    </p>
                                  </div>
                                )}
                              </RadioGroup>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="Amazon Polly" className="border-none p-0 mt-4">
                            <div className="space-y-4">
                              <RadioGroup value={voice} onValueChange={handleVoiceChange} className="grid grid-cols-2 gap-4">
                                {Object.keys(voiceSamples["Amazon Polly"]).map((voiceName) => (
                                  <div key={voiceName} className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
                                    <RadioGroupItem value={voiceName} id={`polly-${voiceName.toLowerCase()}`} />
                                    <Label htmlFor={`polly-${voiceName.toLowerCase()}`} className="font-medium cursor-pointer flex-1">{voiceName}</Label>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className={`h-6 ${currentlyPlaying === voiceName ? 'bg-agent-primary border-agent-primary text-white' : 'bg-black/20 border-gray-700'} text-xs`}
                                      onClick={() => handlePlaySample(voiceName)}
                                    >
                                      {currentlyPlaying === voiceName ? 'Stop' : 'Preview'}
                                    </Button>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="Google TTS" className="border-none p-0 mt-4">
                            <div className="space-y-4">
                              <RadioGroup value={voice} onValueChange={handleVoiceChange} className="grid grid-cols-2 gap-4">
                                {Object.keys(voiceSamples["Google TTS"]).map((voiceName) => (
                                  <div key={voiceName} className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
                                    <RadioGroupItem value={voiceName} id={`google-${voiceName.toLowerCase().replace(' ', '-')}`} />
                                    <Label htmlFor={`google-${voiceName.toLowerCase().replace(' ', '-')}`} className="font-medium cursor-pointer flex-1">{voiceName}</Label>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className={`h-6 ${currentlyPlaying === voiceName ? 'bg-agent-primary border-agent-primary text-white' : 'bg-black/20 border-gray-700'} text-xs`}
                                      onClick={() => handlePlaySample(voiceName)}
                                    >
                                      {currentlyPlaying === voiceName ? 'Stop' : 'Preview'}
                                    </Button>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={() => setIsVoiceDialogOpen(false)} className="bg-black/20 border-gray-700 hover:bg-gray-800">
                            Cancel
                          </Button>
                          <Button onClick={handleVoiceSelectionSave} className="bg-agent-primary hover:bg-agent-primary/90">
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <AgentStats 
                    avmScore={agentWithAvmScore.avmScore} 
                    interactionCount={agent.interactions}
                    csat={agent.csat}
                    performance={agent.performance}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="bg-agent-dark-bg/50 border border-gray-800">
          <TabsTrigger value="setup" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
            Setup
          </TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-agent-primary data-[state=active]:text-white text-gray-400">
            Integration
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
        
        <TabsContent value="integration" className="animate-fade-in">
          <Card className="bg-agent-dark-bg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Integration Details</CardTitle>
              <CardDescription className="text-gray-400">Connect your agent with other systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-black/30 rounded-lg border border-gray-700/50">
                <h4 className="text-sm text-white font-medium mb-2">API Connection</h4>
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-black/50 p-2 rounded text-gray-300 font-mono">
                    api.agent.ai/v1/{agent.id}
                  </code>
                  <Button size="sm" variant="outline" className="h-7 text-xs bg-black/50 border-gray-700">
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700/50">
                <div>
                  <h4 className="text-sm text-white font-medium">Documentation</h4>
                  <p className="text-xs text-gray-400">View detailed API reference</p>
                </div>
                <Button size="sm" variant="outline" className="h-8 bg-black/50 border-gray-700">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Open Docs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <Card className="bg-agent-dark-bg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Analytics</CardTitle>
              <CardDescription className="text-gray-400">Monitor your agent's performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 text-agent-primary/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">Analytics Dashboard</h3>
                <p className="text-gray-400 max-w-md">
                  Detailed performance metrics will appear here once your agent has more interactions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <Card className="bg-agent-dark-bg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Agent Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure your agent's behavior</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Settings className="h-12 w-12 text-agent-primary/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">Settings Panel</h3>
                <p className="text-gray-400 max-w-md">
                  Configure how your agent works including behavior, voice, and response parameters.
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
