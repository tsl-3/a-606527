
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Volume2, Play, Pause } from 'lucide-react';
import { VoiceTrait } from '@/types/agent';

interface VoiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
  voiceProvider: string;
  onVoiceProviderChange: (provider: string) => void;
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

const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({
  open,
  onOpenChange,
  selectedVoice,
  onVoiceSelect,
  voiceProvider,
  onVoiceProviderChange
}) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const getCurrentVoiceDetails = () => {
    for (const provider in VOICE_PROVIDERS) {
      for (const voiceName in VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS]) {
        const voiceObj = VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS][voiceName];
        if (voiceObj.id === selectedVoice) {
          return voiceObj;
        }
      }
    }
    
    // Default to first voice if not found
    const firstProvider = Object.keys(VOICE_PROVIDERS)[0] as keyof typeof VOICE_PROVIDERS;
    const firstVoiceName = Object.keys(VOICE_PROVIDERS[firstProvider])[0];
    return VOICE_PROVIDERS[firstProvider][firstVoiceName];
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
      console.error("Error playing audio sample");
      setCurrentlyPlaying(null);
    };
    
    audio.play().catch(err => {
      console.error("Error playing audio:", err);
      setCurrentlyPlaying(null);
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Select Voice</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={voiceProvider} onValueChange={onVoiceProviderChange} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            {Object.keys(VOICE_PROVIDERS).map((provider) => (
              <TabsTrigger key={provider} value={provider}>
                {provider}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(VOICE_PROVIDERS).map((provider) => (
            <TabsContent key={provider} value={provider} className="mt-4">
              <ScrollArea className="h-[350px] w-full rounded-md border">
                <div className="p-4 space-y-4">
                  {Object.keys(VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS]).map((voiceName) => {
                    const voiceObj = VOICE_PROVIDERS[provider as keyof typeof VOICE_PROVIDERS][voiceName];
                    return (
                      <div 
                        key={voiceObj.id} 
                        className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${selectedVoice === voiceObj.id ? 'bg-muted border border-agent-primary/30' : ''}`}
                        onClick={() => onVoiceSelect(voiceObj.id)}
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
                            {selectedVoice === voiceObj.id && (
                              <Badge variant="outline" className="bg-agent-primary/10 text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {voiceObj.traits?.map((trait: VoiceTrait, idx: number) => (
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
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionModal;
