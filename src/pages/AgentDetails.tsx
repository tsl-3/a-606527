import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Bot, Trash2, AlertCircle, Loader2, 
  ExternalLink, History, BarChart2, Cpu, Calendar, Mic, Volume2, MessageSquare, Plus, Play, Pause,
  Phone, Copy, PhoneOutgoing, Mail, Send, MoreVertical, Archive, UserMinus, PenSquare, Cog
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
import { VoiceTrait, AgentType } from "@/types/agent";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { AgentSetupStepper } from "@/components/AgentSetupStepper";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentChannels } from "@/components/AgentChannels";
import { AgentStats } from "@/components/AgentStats";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateAgent } from "@/services/agentService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SAMPLE_TEXT = "Hello, I'm an AI assistant and I'm here to help you with your questions.";

interface VoiceDefinition {
  id: string;
  name: string;
  traits: VoiceTrait[];
  avatar?: string;
  audioSample: string;
}

const voiceSamples: Record<string, Record<string, VoiceDefinition>> = {
  "Eleven Labs": {
    "Emma": {
      id: "9BWtsMINqrJLrRacOk9x",
      name: "Emma",
      traits: [
        { name: "British", color: "bg-blue-100 text-blue-800" },
        { name: "Professional", color: "bg-purple-100 text-purple-800" }
      ],
      avatar: "/voices/avatars/emma.jpg",
      audioSample: "/voices/eleven-emma.mp3"
    },
    "Josh": {
      id: "CwhRBWXzGAHq8TQ4Fs17",
      name: "Josh",
      traits: [
        { name: "American", color: "bg-red-100 text-red-800" },
        { name: "Casual", color: "bg-green-100 text-green-800" }
      ],
      avatar: "/voices/avatars/josh.jpg",
      audioSample: "/voices/eleven-josh.mp3"
    },
    "Aria": {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Aria",
      traits: [
        { name: "Young", color: "bg-yellow-100 text-yellow-800" },
        { name: "Friendly", color: "bg-pink-100 text-pink-800" }
      ],
      avatar: "/voices/avatars/aria.jpg",
      audioSample: "/voices/eleven-aria.mp3"
    },
    "Charlie": {
      id: "IKne3meq5aSn9XLyUdCD",
      name: "Charlie",
      traits: [
        { name: "Australian", color: "bg-green-100 text-green-800" },
        { name: "Energetic", color: "bg-orange-100 text-orange-800" }
      ],
      avatar: "/voices/avatars/charlie.jpg",
      audioSample: "/voices/eleven-charlie.mp3"
    }
  },
  "Amazon Polly": {
    "Joanna": {
      id: "Joanna",
      name: "Joanna",
      traits: [
        { name: "American", color: "bg-red-100 text-red-800" },
        { name: "Professional", color: "bg-purple-100 text-purple-800" }
      ],
      avatar: "/voices/avatars/joanna.jpg",
      audioSample: "/voices/polly-joanna.mp3"
    },
    "Matthew": {
      id: "Matthew",
      name: "Matthew",
      traits: [
        { name: "American", color: "bg-red-100 text-red-800" },
        { name: "Deep", color: "bg-blue-100 text-blue-800" }
      ],
      avatar: "/voices/avatars/matthew.jpg",
      audioSample: "/voices/polly-matthew.mp3"
    }
  },
  "Google TTS": {
    "Wavenet A": {
      id: "en-US-Wavenet-A",
      name: "Wavenet A",
      traits: [
        { name: "American", color: "bg-red-100 text-red-800" },
        { name: "Neutral", color: "bg-gray-100 text-gray-800" }
      ],
      avatar: "/voices/avatars/wavenet-a.jpg",
      audioSample: "/voices/google-wavenet-a.mp3"
    },
    "Wavenet B": {
      id: "en-US-Wavenet-B",
      name: "Wavenet B",
      traits: [
        { name: "British", color: "bg-blue-100 text-blue-800" },
        { name: "Formal", color: "bg-indigo-100 text-indigo-800" }
      ],
      avatar: "/voices/avatars/wavenet-b.jpg",
      audioSample: "/voices/google-wavenet-b.mp3"
    }
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
  const [selectedVoiceTraits, setSelectedVoiceTraits] = useState<VoiceTrait[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (agent) {
      setIsActive(agent.status === "active");
      setModel(agent.model || "GPT-4");
      setVoice(agent.voice || "Emma");
      setVoiceProvider(agent.voiceProvider || "Eleven Labs");
      setCustomVoiceId(agent.customVoiceId || "");
      setIsCustomVoice(agent.voice === "Custom");
      
      if (agent.voice && agent.voiceProvider && !isCustomVoice) {
        const voiceDef = voiceSamples[agent.voiceProvider]?.[agent.voice];
        if (voiceDef) {
          setSelectedVoiceTraits(voiceDef.traits || []);
          setSelectedVoiceId(voiceDef.id || "");
        }
      }
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

  const handleVoiceChange = async (voiceName: string) => {
    setVoice(voiceName);
    setIsCustomVoice(voiceName === "Custom");
    
    if (voiceName !== "Custom") {
      const voiceDef = voiceSamples[voiceProvider]?.[voiceName];
      if (voiceDef) {
        setSelectedVoiceTraits(voiceDef.traits || []);
        setSelectedVoiceId(voiceDef.id || "");
      }
      
      if (currentlyPlaying !== voiceName) {
        handlePlaySample(voiceName);
      }
    } else {
      setSelectedVoiceTraits([]);
      setSelectedVoiceId(customVoiceId);
    }
  };

  const handleProviderChange = async (value: string) => {
    setVoiceProvider(value);
    const voices = Object.keys(voiceSamples[value as keyof typeof voiceSamples] || {});
    if (voices.length > 0) {
      setVoice(voices[0]);
      const voiceDef = voiceSamples[value]?.[voices[0]];
      if (voiceDef) {
        setSelectedVoiceTraits(voiceDef.traits || []);
        setSelectedVoiceId(voiceDef.id || "");
      }
      setIsCustomVoice(voices[0] === "Custom");
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
  };

  const handleCustomVoiceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomVoiceId(e.target.value);
    setSelectedVoiceId(e.target.value);
  };

  const handlePlaySample = (voiceName: string) => {
    if (currentlyPlaying === voiceName) {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
      return;
    }
    
    const voicePath = voiceSamples[voiceProvider as keyof typeof voiceSamples]?.[voiceName]?.audioSample;
    
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
          customVoiceId: isCustomVoice ? customVoiceId : undefined,
          voiceTraits: isCustomVoice ? [] : selectedVoiceTraits
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

  const handleCopyPhoneNumber = () => {
    if (voicePhoneNumber) {
      navigator.clipboard.writeText(voicePhoneNumber);
      toast({
        title: "Phone number copied",
        description: "Phone number has been copied to clipboard.",
      });
    }
  };

  const handleTestCall = () => {
    if (voicePhoneNumber) {
      window.location.href = `tel:${voicePhoneNumber}`;
      toast({
        title: "Calling agent",
        description: `Initiating call to ${voicePhoneNumber}`,
      });
    } else {
      toast({
        title: "No phone number available",
        description: "Please configure a phone number for voice channel first.",
        variant: "destructive",
      });
    }
  };

  const handleCopyEmail = () => {
    if (emailAddress) {
      navigator.clipboard.writeText(emailAddress);
      toast({
        title: "Email address copied",
        description: "Email address has been copied to clipboard.",
      });
    }
  };

  const handleTestEmail = () => {
    if (emailAddress) {
      window.location.href = `mailto:${emailAddress}?subject=Test Email for ${agent?.name || 'Agent'}&body=This is a test email for your AI agent.`;
      toast({
        title: "Composing email",
        description: `Opening email client to send test email to ${emailAddress}`,
      });
    } else {
      toast({
        title: "No email address available",
        description: "Please configure an email address for email channel first.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateAgent = () => {
    setIsActive(false);
    toast({
      title: "Agent Deactivated",
      description: "Your agent has been deactivated and won't process new requests.",
      variant: "destructive",
    });
  };

  const handleArchiveAgent = () => {
    toast({
      title: "Agent Archived",
      description: "The agent has been archived and can be restored later.",
    });
    navigate("/agents");
  };

  const handleEditClick = () => {
    toast({
      title: "Edit Mode",
      description: "You can now edit your agent's details.",
    });
    // In a real app, you might navigate to an edit page or enable edit mode
  };

  const handleCopyAvatar = () => {
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${agent?.id}`;
    if (avatarUrl) {
      navigator.clipboard.writeText(avatarUrl);
      toast({
        title: "Avatar copied",
        description: "Avatar URL has been copied to clipboard.",
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
    avmScore: agent.avmScore || 7.8,
    voiceProvider: voiceProvider,
    voice: voice,
    model: model,
    channelConfigs: agent.channelConfigs || {},
    onUpdateChannel: handleUpdateChannel
  };
  
  const lastUpdated = new Date().toLocaleString();
  
  const voicePhoneNumber = agent.channelConfigs?.voice?.details || null;
  const emailAddress = agent.channelConfigs?.email?.details || null;
  
  const activeChannels = Object.entries(agent.channelConfigs || {})
    .filter(([_, config]) => config.enabled)
    .map(([channel]) => channel);
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link to="/agents" className="flex items-center text-gray-500 hover:text-agent-primary transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Back to Agents</span>
        </Link>
      </div>
      
      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-agent-primary/30">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`} 
                    alt={agent.name} 
                  />
                  <AvatarFallback className="bg-agent-primary/20 text-agent-primary">
                    <Bot className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {agent.name}
                  </h1>
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
                <p className="text-muted-foreground mt-1.5 max-w-2xl">{agent.description}</p>
                
                {activeChannels.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeChannels.includes('voice') && (
                      <Badge className="bg-blue-500 text-white px-2 py-0.5 flex items-center gap-1">
                        <Mic className="h-3 w-3" />
                        <span className="text-xs">Voice</span>
                      </Badge>
                    )}
                    {activeChannels.includes('chat') && (
                      <Badge className="bg-purple-500 text-white px-2 py-0.5 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span className="text-xs">Chat</span>
                      </Badge>
                    )}
                    {activeChannels.includes('email') && (
                      <Badge className="bg-red-500 text-white px-2 py-0.5 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">Email</span>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex items-center justify-end space-x-3 mt-2 md:mt-0">
                <AgentToggle isActive={isActive} onToggle={handleStatusToggle} />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hover:bg-secondary">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer flex items-center gap-2">
                      <PenSquare className="h-4 w-4 text-agent-primary" />
                      <span>Edit Agent</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeactivateAgent} className="cursor-pointer flex items-center gap-2">
                      <UserMinus className="h-4 w-4 text-yellow-500" />
                      <span>Deactivate Agent</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleArchiveAgent} className="cursor-pointer flex items-center gap-2">
                      <Archive className="h-4 w-4 text-blue-500" />
                      <span>Archive Agent</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="cursor-pointer flex items-center gap-2 text-red-400">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Agent</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {voicePhoneNumber && (
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg border border-border p-2">
                      <Phone className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs">
                        {voicePhoneNumber}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-secondary"
                          onClick={handleCopyPhoneNumber}
                          title="Copy phone number"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-green-700/50"
                          onClick={handleTestCall}
                          title="Test agent call"
                        >
                          <PhoneOutgoing className="h-3 w-3 text-green-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {emailAddress && (
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg border border-border p-2">
                      <Mail className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs">
                        {emailAddress}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-secondary"
                          onClick={handleCopyEmail}
                          title="Copy email address"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-green-700/50"
                          onClick={handleTestEmail}
                          title="Test agent email"
                        >
                          <Send className="h-3 w-3 text-green-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-secondary/30 px-4 py-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3.5 w-3.5 text-agent-primary" />
                        <span className="text-xs text-muted-foreground">Type</span>
                      </div>
                      <p className="text-sm font-medium capitalize">
                        {agent.type}
                      </p>
                    </div>
                  
                    <div className="bg-secondary/30 px-4 py-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3.5 w-3.5 text-agent-primary" />
                        <span className="text-xs text-muted-foreground">Created On</span>
                      </div>
                      <p className="text-sm font-medium">
                        {agent.createdAt}
                      </p>
                    </div>
                    
                    <div className="bg-secondary/30 px-4 py-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <History className="h-3.5 w-3.5 text-agent-primary" />
                        <span className="text-xs text-muted-foreground">Updated</span>
                      </div>
                      <p className="text-sm font-medium">
                        {lastUpdated.split(',')[0]}
                      </p>
                    </div>

                    <div className="bg-secondary/30 px-4 py-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="h-3.5 w-3.5 text-agent-primary" />
                        <span className="text-xs text-muted-foreground">Model</span>
                      </div>
                      <Select value={model} onValueChange={handleModelChange}>
                        <SelectTrigger className="h-7 w-full bg-background/50 border-input">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GPT-4">GPT-4</SelectItem>
                          <SelectItem value="GPT-3.5 Turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="Claude-2">Claude-2</SelectItem>
                          <SelectItem value="LLama-2">LLama-2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-secondary/30 px-4 py-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Volume2 className="h-3.5 w-3.5 text-agent-primary" />
                        <span className="text-xs text-muted-foreground">Voice</span>
                      </div>
                      <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 w-full bg-background/50 border-input justify-between">
                            <span className="truncate">
                              {isCustomVoice ? `Custom (${customVoiceId.substring(0, 6)}...)` : `${voice} (${voiceProvider})`}
                            </span>
                            {voicePhoneNumber && (
                              <span className="text-xs text-muted-foreground truncate ml-1">{voicePhoneNumber}</span>
                            )}
                            <span className="sr-only">Edit voice</span>
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                          <DialogHeader>
                            <DialogTitle>Configure Voice</DialogTitle>
                            <DialogDescription>
                              Select a voice provider and voice for your agent, or enter a custom voice ID
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Tabs defaultValue={voiceProvider} className="w-full" onValueChange={handleProviderChange}>
                            <TabsList className="w-full grid grid-cols-3">
                              <TabsTrigger value="Eleven Labs">
                                Eleven Labs
                              </TabsTrigger>
                              <TabsTrigger value="Amazon Polly">
                                Amazon Polly
                              </TabsTrigger>
                              <TabsTrigger value="Google TTS">
                                Google TTS
                              </TabsTrigger>
                            </TabsList>
                            
                            <div className="mt-4 flex-1 overflow-hidden">
                              <ScrollArea className="h-[50vh] pr-4">
                                <TabsContent value="Eleven Labs" className="border-none p-0">
                                  <RadioGroup value={voice} onValueChange={handleVoiceChange} className="space-y-3">
                                    {Object.keys(voiceSamples["Eleven Labs"]).map((voiceName) => {
                                      const voiceDef = voiceSamples["Eleven Labs"][voiceName];
                                      return (
                                        <div 
                                          key={voiceName} 
                                          className={`flex items-start space-x-3 rounded-lg border p-3 ${voice === voiceName ? 'bg-secondary/50 border-agent-primary/30' : 'hover:bg-secondary/30'}`}
                                        >
                                          <RadioGroupItem value={voiceName} id={`voice-${voiceName}`} />
                                          <div className="flex w-full justify-between items-center">
                                            <div className="flex gap-3">
                                              {voiceDef.avatar && (
                                                <Avatar className="h-10 w-10 rounded-full">
                                                  <AvatarImage src={voiceDef.avatar} alt={voiceName} />
                                                  <AvatarFallback>
                                                    {voiceName.substring(0, 2)}
                                                  </AvatarFallback>
                                                </Avatar>
                                              )}
                                              <div>
                                                <Label 
                                                  htmlFor={`voice-${voiceName}`}
                                                  className="text-base font-medium cursor-pointer"
                                                >
                                                  {voiceName}
                                                </Label>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                  {voiceDef.traits.map((trait, i) => (
                                                    <span 
                                                      key={i} 
                                                      className={`text-xs px-2 py-0.5 rounded-full ${trait.color}`}
                                                    >
                                                      {trait.name}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="ghost" 
                                              className="ml-auto h-7 w-7 p-0 rounded-full"
                                              onClick={() => handlePlaySample(voiceName)}
                                            >
                                              {currentlyPlaying === voiceName ? (
                                                <Pause className="h-4 w-4" />
                                              ) : (
                                                <Play className="h-4 w-4" />
                                              )}
                                              <span className="sr-only">
                                                {currentlyPlaying === voiceName ? "Pause" : "Play"} sample
                                              </span>
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    <div 
                                      className={`flex items-start space-x-3 rounded-lg border p-3 ${isCustomVoice ? 'bg-secondary/50 border-agent-primary/30' : 'hover:bg-secondary/30'}`}
                                    >
                                      <RadioGroupItem value="Custom" id="voice-custom" />
                                      <div className="flex flex-col w-full gap-3">
                                        <Label 
                                          htmlFor="voice-custom"
                                          className="text-base font-medium cursor-pointer"
                                        >
                                          Custom Voice ID
                                        </Label>
                                        <Input 
                                          disabled={!isCustomVoice}
                                          placeholder="Enter custom voice ID"
                                          value={customVoiceId}
                                          onChange={handleCustomVoiceIdChange}
                                        />
                                      </div>
                                    </div>
                                  </RadioGroup>
                                </TabsContent>

                                <TabsContent value="Amazon Polly" className="border-none p-0">
                                  <RadioGroup value={voice} onValueChange={handleVoiceChange} className="space-y-3">
                                    {Object.keys(voiceSamples["Amazon Polly"] || {}).map((voiceName) => {
                                      const voiceDef = voiceSamples["Amazon Polly"][voiceName];
                                      return (
                                        <div 
                                          key={voiceName} 
                                          className={`flex items-start space-x-3 rounded-lg border p-3 ${voice === voiceName ? 'bg-secondary/50 border-agent-primary/30' : 'hover:bg-secondary/30'}`}
                                        >
                                          <RadioGroupItem value={voiceName} id={`voice-${voiceName}`} />
                                          <div className="flex w-full justify-between items-center">
                                            <div className="flex gap-3">
                                              {voiceDef.avatar && (
                                                <Avatar className="h-10 w-10 rounded-full">
                                                  <AvatarImage src={voiceDef.avatar} alt={voiceName} />
                                                  <AvatarFallback>
                                                    {voiceName.substring(0, 2)}
                                                  </AvatarFallback>
                                                </Avatar>
                                              )}
                                              <div>
                                                <Label 
                                                  htmlFor={`voice-${voiceName}`}
                                                  className="text-base font-medium cursor-pointer"
                                                >
                                                  {voiceName}
                                                </Label>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                  {voiceDef.traits.map((trait, i) => (
                                                    <span 
                                                      key={i} 
                                                      className={`text-xs px-2 py-0.5 rounded-full ${trait.color}`}
                                                    >
                                                      {trait.name}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="ghost" 
                                              className="ml-auto h-7 w-7 p-0 rounded-full"
                                              onClick={() => handlePlaySample(voiceName)}
                                            >
                                              {currentlyPlaying === voiceName ? (
                                                <Pause className="h-4 w-4" />
                                              ) : (
                                                <Play className="h-4 w-4" />
                                              )}
                                              <span className="sr-only">
                                                {currentlyPlaying === voiceName ? "Pause" : "Play"} sample
                                              </span>
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </RadioGroup>
                                </TabsContent>

                                <TabsContent value="Google TTS" className="border-none p-0">
                                  <RadioGroup value={voice} onValueChange={handleVoiceChange} className="space-y-3">
                                    {Object.keys(voiceSamples["Google TTS"] || {}).map((voiceName) => {
                                      const voiceDef = voiceSamples["Google TTS"][voiceName];
                                      return (
                                        <div 
                                          key={voiceName} 
                                          className={`flex items-start space-x-3 rounded-lg border p-3 ${voice === voiceName ? 'bg-secondary/50 border-agent-primary/30' : 'hover:bg-secondary/30'}`}
                                        >
                                          <RadioGroupItem value={voiceName} id={`voice-${voiceName}`} />
                                          <div className="flex w-full justify-between items-center">
                                            <div className="flex gap-3">
                                              {voiceDef.avatar && (
                                                <Avatar className="h-10 w-10 rounded-full">
                                                  <AvatarImage src={voiceDef.avatar} alt={voiceName} />
                                                  <AvatarFallback>
                                                    {voiceName.substring(0, 2)}
                                                  </AvatarFallback>
                                                </Avatar>
                                              )}
                                              <div>
                                                <Label 
                                                  htmlFor={`voice-${voiceName}`}
                                                  className="text-base font-medium cursor-pointer"
                                                >
                                                  {voiceName}
                                                </Label>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                  {voiceDef.traits.map((trait, i) => (
                                                    <span 
                                                      key={i} 
                                                      className={`text-xs px-2 py-0.5 rounded-full ${trait.color}`}
                                                    >
                                                      {trait.name}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="ghost" 
                                              className="ml-auto h-7 w-7 p-0 rounded-full"
                                              onClick={() => handlePlaySample(voiceName)}
                                            >
                                              {currentlyPlaying === voiceName ? (
                                                <Pause className="h-4 w-4" />
                                              ) : (
                                                <Play className="h-4 w-4" />
                                              )}
                                              <span className="sr-only">
                                                {currentlyPlaying === voiceName ? "Pause" : "Play"} sample
                                              </span>
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </RadioGroup>
                                </TabsContent>
                              </ScrollArea>
                            </div>
                          </Tabs>
                          
                          <div className="mt-5 flex justify-end">
                            <Button onClick={handleVoiceSelectionSave}>
                              Save Voice Settings
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <AgentStats
                    avmScore={agent.avmScore || 7.8}
                    interactionCount={agent.interactions || 0}
                    csat={agent.csat || 85}
                    performance={agent.performance || 92}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="setup">
              <div className="space-y-8">
                <div className="bg-secondary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Agent Setup Steps</h3>
                  <AgentSetupStepper agent={agentWithAvmScore} />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Environment Configuration</CardTitle>
                    <CardDescription>
                      Configure your agent's environment variables and settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="api-key">API Key</Label>
                          <Input id="api-key" type="password" value="••••••••••••••••••••" disabled />
                        </div>
                        <div>
                          <Label htmlFor="endpoint">Endpoint URL</Label>
                          <Input id="endpoint" value="https://api.example.com/agents" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="integration-id">Integration ID</Label>
                        <Input id="integration-id" value={`int_${agent.id}_${Math.random().toString(36).substring(2, 8)}`} />
                      </div>
                      <div className="flex justify-end">
                        <Button>Save Configuration</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="channels">
              <div className="space-y-6">
                <div className="bg-secondary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Communication Channels</h3>
                  <p className="text-muted-foreground">
                    Configure the channels through which your agent can communicate with users.
                    Enable or disable channels and set up the necessary configuration.
                  </p>
                </div>
                
                <AgentChannels 
                  channels={agent.channelConfigs || {}}
                  onUpdateChannel={handleUpdateChannel}
                />
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="bg-secondary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Agent Settings</h3>
                  <p className="text-muted-foreground">
                    Configure general settings for your agent including name, description, and other properties.
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">General Settings</CardTitle>
                    <CardDescription>
                      Basic information about your agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="agent-name">Agent Name</Label>
                          <Input id="agent-name" defaultValue={agent.name} />
                        </div>
                        <div>
                          <Label htmlFor="agent-type">Agent Type</Label>
                          <Select defaultValue={agent.type}>
                            <SelectTrigger id="agent-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer_support">Customer Support</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="technical_support">Technical Support</SelectItem>
                              <SelectItem value="concierge">Concierge</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="agent-description">Description</Label>
                        <textarea
                          id="agent-description"
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          rows={3}
                          defaultValue={agent.description}
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <Button>Save Settings</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Danger Zone</CardTitle>
                    <CardDescription>
                      Destructive actions for your agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/30 rounded-lg">
                        <div>
                          <h4 className="font-medium">Delete Agent</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete this agent and all associated data
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete Agent
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800/30 rounded-lg">
                        <div>
                          <h4 className="font-medium">Archive Agent</h4>
                          <p className="text-sm text-muted-foreground">
                            Temporarily archive this agent (can be restored later)
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleArchiveAgent}>
                          Archive Agent
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDetails;

