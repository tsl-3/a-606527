import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentType, VoiceTrait } from '@/types/agent';
import { updateAgent } from '@/services/agentService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, Copy, Target, User, FileText, Code, Building, Briefcase, 
  Headphones, ShoppingCart, Wrench, CircuitBoard, GraduationCap, Plane, 
  Factory, ShieldCheck, Phone, Home, Plus, MessageSquare,
  HeartPulse, Landmark, Wallet, BarChart4, Calendar, Mic, Brain, Play, Pause, Volume2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import debounce from 'lodash/debounce';
import { AgentChannels } from '@/components/AgentChannels';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { isEqual } from 'lodash';

interface AgentConfigSettingsProps {
  agent: AgentType;
  onAgentUpdate: (updatedAgent: AgentType) => void;
  showSuccessToast?: (title: string, description: string) => void;
}

const VOICE_PROVIDERS = {
  "Eleven Labs": {
    "Aria": {
      id: "9BWtsMINqrJLrRacOk9x",
      name: "Aria",
      traits: [{
        name: "Young",
        color: "bg-yellow-100 text-yellow-800"
      }, {
        name: "Friendly",
        color: "bg-pink-100 text-pink-800"
      }],
      avatar: "/voices/avatars/aria.jpg",
      audioSample: "/voices/eleven-aria.mp3"
    },
    "Roger": {
      id: "CwhRBWXzGAHq8TQ4Fs17",
      name: "Roger",
      traits: [{
        name: "American",
        color: "bg-red-100 text-red-800"
      }, {
        name: "Casual",
        color: "bg-green-100 text-green-800"
      }],
      avatar: "/voices/avatars/roger.jpg",
      audioSample: "/voices/eleven-roger.mp3"
    },
    "Sarah": {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Sarah",
      traits: [{
        name: "British",
        color: "bg-blue-100 text-blue-800"
      }, {
        name: "Professional",
        color: "bg-purple-100 text-purple-800"
      }],
      avatar: "/voices/avatars/sarah.jpg",
      audioSample: "/voices/eleven-sarah.mp3"
    },
    "Charlie": {
      id: "IKne3meq5aSn9XLyUdCD",
      name: "Charlie",
      traits: [{
        name: "Australian",
        color: "bg-green-100 text-green-800"
      }, {
        name: "Energetic",
        color: "bg-orange-100 text-orange-800"
      }],
      avatar: "/voices/avatars/charlie.jpg",
      audioSample: "/voices/eleven-charlie.mp3"
    }
  },
  "Amazon Polly": {
    "Joanna": {
      id: "Joanna",
      name: "Joanna",
      traits: [{
        name: "American",
        color: "bg-red-100 text-red-800"
      }, {
        name: "Professional",
        color: "bg-purple-100 text-purple-800"
      }],
      avatar: "/voices/avatars/joanna.jpg",
      audioSample: "/voices/polly-joanna.mp3"
    },
    "Matthew": {
      id: "Matthew",
      name: "Matthew",
      traits: [{
        name: "American",
        color: "bg-red-100 text-red-800"
      }, {
        name: "Deep",
        color: "bg-blue-100 text-blue-800"
      }],
      avatar: "/voices/avatars/matthew.jpg",
      audioSample: "/voices/polly-matthew.mp3"
    }
  },
  "Google TTS": {
    "Wavenet A": {
      id: "en-US-Wavenet-A",
      name: "Wavenet A",
      traits: [{
        name: "American",
        color: "bg-red-100 text-red-800"
      }, {
        name: "Neutral",
        color: "bg-gray-100 text-gray-800"
      }],
      avatar: "/voices/avatars/wavenet-a.jpg",
      audioSample: "/voices/google-wavenet-a.mp3"
    },
    "Wavenet B": {
      id: "en-US-Wavenet-B",
      name: "Wavenet B",
      traits: [{
        name: "British",
        color: "bg-blue-100 text-blue-800"
      }, {
        name: "Formal",
        color: "bg-indigo-100 text-indigo-800"
      }],
      avatar: "/voices/avatars/wavenet-b.jpg",
      audioSample: "/voices/google-wavenet-b.mp3"
    }
  }
};

const INDUSTRIES = [
  { id: "healthcare", name: "Healthcare", icon: <HeartPulse className="h-4 w-4" /> },
  { id: "finance", name: "Finance & Banking", icon: <Landmark className="h-4 w-4" /> },
  { id: "retail", name: "Retail & E-commerce", icon: <ShoppingCart className="h-4 w-4" /> },
  { id: "technology", name: "Technology & Software", icon: <CircuitBoard className="h-4 w-4" /> },
  { id: "education", name: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "hospitality", name: "Hospitality & Travel", icon: <Plane className="h-4 w-4" /> },
  { id: "manufacturing", name: "Manufacturing", icon: <Factory className="h-4 w-4" /> },
  { id: "insurance", name: "Insurance", icon: <ShieldCheck className="h-4 w-4" /> },
  { id: "telecommunications", name: "Telecommunications", icon: <Phone className="h-4 w-4" /> },
  { id: "real-estate", name: "Real Estate", icon: <Home className="h-4 w-4" /> },
  { id: "other", name: "Other Industry", icon: <Plus className="h-4 w-4" /> }
];

const BOT_FUNCTIONS = [
  { id: "customer-service", name: "Customer Service", icon: <Headphones className="h-4 w-4" /> },
  { id: "sales", name: "Sales & Marketing", icon: <BarChart4 className="h-4 w-4" /> },
  { id: "support", name: "Technical Support", icon: <Wrench className="h-4 w-4" /> },
  { id: "it-helpdesk", name: "IT Helpdesk", icon: <CircuitBoard className="h-4 w-4" /> },
  { id: "lead-generation", name: "Lead Generation", icon: <Target className="h-4 w-4" /> },
  { id: "booking", name: "Appointment Booking", icon: <Calendar className="h-4 w-4" /> },
  { id: "faq", name: "FAQ & Knowledge Base", icon: <FileText className="h-4 w-4" /> },
  { id: "onboarding", name: "Customer Onboarding", icon: <User className="h-4 w-4" /> },
  { id: "billing", name: "Billing & Payments", icon: <Wallet className="h-4 w-4" /> },
  { id: "feedback", name: "Feedback Collection", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "other", name: "Other Function", icon: <Plus className="h-4 w-4" /> }
];

const AI_MODELS = [
  { id: "GPT-4", name: "GPT-4 Turbo" },
  { id: "GPT-3.5", name: "GPT-3.5" },
  { id: "Claude-3", name: "Claude 3 Opus" },
  { id: "Claude-3-Sonnet", name: "Claude 3 Sonnet" },
  { id: "Claude-3-Haiku", name: "Claude 3 Haiku" },
  { id: "Gemini-Pro", name: "Gemini Pro" },
  { id: "Llama-3", name: "Llama 3" }
];

const AgentConfigSettings: React.FC<AgentConfigSettingsProps> = ({ agent, onAgentUpdate, showSuccessToast }) => {
  const { toast } = useToast();
  const [name, setName] = useState(agent.name);
  const [avatar, setAvatar] = useState(agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`);
  const [purpose, setPurpose] = useState(agent.purpose || '');
  const [prompt, setPrompt] = useState(agent.prompt || '');
  const [industry, setIndustry] = useState(agent.industry || '');
  const [botFunction, setBotFunction] = useState(agent.botFunction || '');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customFunction, setCustomFunction] = useState('');
  const [model, setModel] = useState(agent.model || 'GPT-4');
  const [voice, setVoice] = useState(agent.voice || '9BWtsMINqrJLrRacOk9x');
  const [voiceProvider, setVoiceProvider] = useState(agent.voiceProvider || 'Eleven Labs');
  const [isSaving, setIsSaving] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedVoiceTraits, setSelectedVoiceTraits] = useState<VoiceTrait[]>([]);
  const [customVoiceId, setCustomVoiceId] = useState('');
  const [isCustomVoice, setIsCustomVoice] = useState(false);
  
  const prevValuesRef = useRef({
    name: agent.name,
    avatar: agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`,
    purpose: agent.purpose || '',
    prompt: agent.prompt || '',
    industry: agent.industry || '',
    botFunction: agent.botFunction || '',
    model: agent.model || 'GPT-4',
    voice: agent.voice || '9BWtsMINqrJLrRacOk9x',
    voiceProvider: agent.voiceProvider || 'Eleven Labs'
  });

  const debouncedSave = React.useCallback(
    debounce(async (updatedData) => {
      try {
        setIsSaving(true);
        const updatedAgent = await updateAgent(agent.id, updatedData);
        onAgentUpdate(updatedAgent);
        
        if (showSuccessToast) {
          showSuccessToast("Changes saved", "Agent configuration has been updated automatically.");
        } else {
          toast({
            title: "Changes saved",
            description: "Agent configuration has been updated automatically."
          });
        }
      } catch (error) {
        console.error("Error saving agent settings:", error);
        toast({
          title: "Failed to save changes",
          description: "There was an error updating the agent configuration.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [agent.id, onAgentUpdate, toast, showSuccessToast]
  );

  useEffect(() => {
    const finalIndustry = industry === 'other' ? customIndustry : industry;
    const finalBotFunction = botFunction === 'other' ? customFunction : botFunction;
    
    const currentValues = {
      name,
      avatar,
      purpose,
      prompt,
      industry: finalIndustry,
      botFunction: finalBotFunction,
      model,
      voice,
      voiceProvider
    };
    
    if (!isEqual(currentValues, prevValuesRef.current)) {
      debouncedSave(currentValues);
      prevValuesRef.current = { ...currentValues };
    }
  }, [name, avatar, purpose, prompt, industry, botFunction, customIndustry, customFunction, model, voice, voiceProvider, debouncedSave]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (agent && agent.voice) {
      if (agent.voice === "Custom") {
        setIsCustomVoice(true);
        setCustomVoiceId(agent.customVoiceId || "");
      } else {
        for (const provider in VOICE_PROVIDERS) {
          for (const voiceName in VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS]) {
            const voiceObj = VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS][voiceName];
            if (voiceObj.id === agent.voice) {
              setVoice(voiceObj.id);
              setVoiceProvider(provider);
              setSelectedVoiceTraits(voiceObj.traits || []);
              break;
            }
          }
        }
      }
    }
  }, [agent]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt copied",
      description: "The agent's prompt has been copied to clipboard."
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.value);
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`);
  };

  const handleVoiceProviderChange = (value: string) => {
    setVoiceProvider(value);
    
    const voices = Object.keys(VOICE_PROVIDERS[value as keyof typeof VOICE_PROVIDERS] || {});
    if (voices.length > 0) {
      const firstVoice = VOICE_PROVIDERS[value as keyof typeof VOICE_PROVIDERS][voices[0]];
      setVoice(firstVoice.id);
      setSelectedVoiceTraits(firstVoice.traits || []);
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setVoice(voiceId);
    
    for (const provider in VOICE_PROVIDERS) {
      for (const voiceName in VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS]) {
        const voiceObj = VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS][voiceName];
        if (voiceObj.id === voiceId) {
          setSelectedVoiceTraits(voiceObj.traits || []);
          break;
        }
      }
    }
  };

  const handlePlaySample = (voiceId: string, providerKey: keyof typeof VOICE_PROVIDERS, voiceName: string) => {
    if (currentlyPlaying === voiceId) {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
      return;
    }
    
    const voicePath = VOICE_PROVIDERS[providerKey][voiceName]?.audioSample;
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
      setCurrentlyPlaying(voiceId);
    };
    
    audio.onerror = () => {
      toast({
        title: "Audio Error",
        description: `Could not play sample for ${voiceName}.`,
        variant: "destructive"
      });
      setCurrentlyPlaying(null);
    };
    
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      setCurrentlyPlaying(null);
    });
  };

  const handleUpdateChannel = async (channel: string, config: {
    enabled: boolean;
    details?: string;
    config?: Record<string, any>;
  }) => {
    if (!agent) return;
    
    let updatedChannels: string[] = [...(agent.channels || [])];
    if (config.enabled && !updatedChannels.includes(channel)) {
      updatedChannels.push(channel);
    } else if (!config.enabled && updatedChannels.includes(channel)) {
      updatedChannels = updatedChannels.filter(c => c !== channel);
    }

    try {
      setIsSaving(true);
      const updatedAgent = {
        ...agent,
        channels: updatedChannels,
        channelConfigs: {
          ...(agent.channelConfigs || {}),
          [channel]: config
        }
      };
      
      const result = await updateAgent(agent.id, updatedAgent);
      onAgentUpdate(result);
      
      toast({
        title: config.enabled ? "Channel enabled" : "Channel disabled",
        description: `The ${channel} channel has been updated.`
      });
    } catch (error) {
      toast({
        title: "Failed to update channel",
        description: "There was an error updating the channel configuration.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Agent Identity</CardTitle>
          <CardDescription>
            Configure how your agent appears to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center space-y-4 w-full">
                <Avatar className="h-32 w-32 border-2 border-agent-primary/30">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>
                    <Bot className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-agent-primary" />
                    <Label htmlFor="agent-avatar">Agent Avatar URL</Label>
                  </div>
                  <Input
                    id="agent-avatar"
                    value={avatar}
                    onChange={handleAvatarChange}
                    placeholder="Enter avatar URL"
                  />
                  <Button 
                    variant="outline" 
                    onClick={generateRandomAvatar} 
                    className="w-full mt-2"
                    size="sm"
                  >
                    Generate Random Avatar
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-agent-primary" />
                  <Label htmlFor="agent-name">Agent Name</Label>
                </div>
                <Input
                  id="agent-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter agent name"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  This name will be displayed to users when they interact with your agent
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-agent-primary" />
                  <Label htmlFor="agent-purpose">Agent Purpose</Label>
                </div>
                <Textarea
                  id="agent-purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe what this agent is designed to do"
                  className="min-h-[100px] w-full"
                />
                <p className="text-xs text-muted-foreground">
                  A clear description of your agent's role and primary responsibilities
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-agent-primary" />
                <Label htmlFor="agent-model">AI Model</Label>
              </div>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="agent-model" className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((aiModel) => (
                    <SelectItem key={aiModel.id} value={aiModel.id}>
                      {aiModel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The AI model that powers your agent's intelligence
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-agent-primary" />
                <Label htmlFor="agent-voice">Voice</Label>
              </div>

              <Tabs defaultValue={voiceProvider} onValueChange={handleVoiceProviderChange} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  {Object.keys(VOICE_PROVIDERS).map((provider) => (
                    <TabsTrigger key={provider} value={provider}>
                      {provider}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.keys(VOICE_PROVIDERS).map((provider) => (
                  <TabsContent key={provider} value={provider} className="mt-4">
                    <ScrollArea className="h-52 w-full rounded-md border">
                      <div className="p-4 space-y-4">
                        {Object.keys(VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS]).map((voiceName) => {
                          const voiceObj = VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS][voiceName];
                          return (
                            <div 
                              key={voiceObj.id} 
                              className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${voice === voiceObj.id ? 'bg-muted border border-agent-primary/30' : ''}`}
                              onClick={() => handleVoiceChange(voiceObj.id)}
                            >
                              <div className="relative">
                                <Avatar className="h-14 w-14">
                                  <AvatarImage src={voiceObj.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${voiceObj.id}`} alt={voiceObj.name} />
                                  <AvatarFallback>
                                    <Volume2 className="h-6 w-6" />
                                  </AvatarFallback>
                                </Avatar>
                                <Button
                                  variant="play"
                                  size="play"
                                  className="absolute -bottom-1 -right-1 shadow-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlaySample(voiceObj.id, provider as keyof typeof VOICE_PROVIDERS, voiceName);
                                  }}
                                >
                                  {currentlyPlaying === voiceObj.id ? (
                                    <Pause className="h-3.5 w-3.5" />
                                  ) : (
                                    <Play className="h-3.5 w-3.5 ml-0.5" />
                                  )}
                                </Button>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{voiceObj.name}</h4>
                                  {voice === voiceObj.id && (
                                    <Badge variant="outline" className="bg-agent-primary/10 text-xs">
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {voiceObj.traits?.map((trait, idx) => (
                                    <Badge key={idx} className={trait.color}>
                                      {trait.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
              
              <p className="text-xs text-muted-foreground">
                The voice your agent will use when speaking to users
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Agent Classification</CardTitle>
          <CardDescription>
            Define the industry and function of your agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-agent-primary" />
                <Label>Industry</Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {INDUSTRIES.map((ind) => (
                  <Button
                    key={ind.id}
                    type="button"
                    variant={industry === ind.id ? "default" : "outline"}
                    className={`justify-start gap-2 ${industry === ind.id ? "border-agent-primary bg-agent-primary text-white" : ""}`}
                    onClick={() => setIndustry(ind.id)}
                  >
                    {ind.icon}
                    <span className="truncate">{ind.name}</span>
                  </Button>
                ))}
              </div>
              
              {industry === 'other' && (
                <div className="mt-2">
                  <Input
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="Enter custom industry"
                    className="w-full"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                The industry context your agent operates in
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-agent-primary" />
                <Label>Bot Function</Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BOT_FUNCTIONS.map((func) => (
                  <Button
                    key={func.id}
                    type="button"
                    variant={botFunction === func.id ? "default" : "outline"}
                    className={`justify-start gap-2 ${botFunction === func.id ? "border-agent-primary bg-agent-primary text-white" : ""}`}
                    onClick={() => setBotFunction(func.id)}
                  >
                    {func.icon}
                    <span className="truncate">{func.name}</span>
                  </Button>
                ))}
              </div>
              
              {botFunction === 'other' && (
                <div className="mt-2">
                  <Input
                    value={customFunction}
                    onChange={(e) => setCustomFunction(e.target.value)}
                    placeholder="Enter custom function"
                    className="w-full"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                The primary function your agent serves
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Channel Configuration</CardTitle>
          <CardDescription>
            Configure the channels through which users can interact with your agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentChannels 
            channels={agent.channelConfigs}
            onUpdateChannel={handleUpdateChannel}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Agent Instructions</CardTitle>
          <CardDescription>
            Define how your agent behaves and responds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-4 w-4 text-agent-primary" />
              <Label htmlFor="agent-prompt" className="text-base font-medium">Prompt Instructions</Label>
            </div>
            
            <div className="relative">
              <Textarea
                id="agent-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the prompt or instructions for this agent"
                className="min-h-[250px] font-mono text-sm pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 opacity-70 hover:opacity-100 bg-muted/50 hover:bg-muted" 
                onClick={handleCopyPrompt}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              These instructions tell the AI how to behave, what knowledge to use, and what tone to adopt
            </p>
          </div>
        </CardContent>
      </Card>
      
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-secondary/80 text-foreground px-4 py-2 rounded-md text-sm animate-in fade-in slide-in-from-bottom-4">
          Saving changes...
        </div>
      )}
    </div>
  );
};

export default AgentConfigSettings;
