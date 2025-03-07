
import React, { useState } from "react";
import { Mic, MessageSquare, Smartphone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AgentChannelConfig {
  enabled: boolean;
  details?: string;
  config?: Record<string, any>;
}

interface AgentChannelsProps {
  channels?: Record<string, AgentChannelConfig>;
  onUpdateChannel?: (channel: string, config: AgentChannelConfig) => void;
  readonly?: boolean;
}

interface ChannelInfo {
  name: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
  bgColor: string;
}

// All available channels with their info
const CHANNEL_INFO: Record<string, ChannelInfo> = {
  "voice": {
    name: "Voice",
    icon: <Mic className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    placeholder: "+1 (800) 123-4567"
  },
  "chat": {
    name: "Chat",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    placeholder: "https://yourwebsite.com/chat"
  },
  "sms": {
    name: "Sms",
    icon: <Smartphone className="h-5 w-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    placeholder: "+1 (800) 123-4567"
  },
  "email": {
    name: "Email",
    icon: <Mail className="h-5 w-5" />,
    color: "text-red-500",
    bgColor: "bg-red-500",
    placeholder: "support@yourcompany.com"
  },
  "whatsapp": {
    name: "Whatsapp",
    icon: <MessageCircle className="h-5 w-5" />,
    color: "text-green-500",
    bgColor: "bg-green-500",
    placeholder: "+1 (555) 987-6543"
  }
};

// All available channels
const ALL_CHANNELS = Object.keys(CHANNEL_INFO);

export const AgentChannels: React.FC<AgentChannelsProps> = ({ 
  channels = {}, 
  onUpdateChannel,
  readonly = false
}) => {
  const [activeDialogChannel, setActiveDialogChannel] = useState<string | null>(null);
  const [channelDetails, setChannelDetails] = useState<string>("");

  // Ensure channels object has entries for all available channels
  const normalizedChannels = ALL_CHANNELS.reduce((acc, channel) => {
    acc[channel] = channels[channel] || { enabled: false };
    return acc;
  }, {} as Record<string, AgentChannelConfig>);
  
  const handleToggleChannel = (channel: string, enabled: boolean) => {
    if (onUpdateChannel) {
      const currentConfig = normalizedChannels[channel] || { enabled: false };
      onUpdateChannel(channel, { ...currentConfig, enabled });
    }
  };

  const handleOpenConfigDialog = (channel: string) => {
    setActiveDialogChannel(channel);
    setChannelDetails(normalizedChannels[channel]?.details || "");
  };

  const handleSaveConfig = () => {
    if (activeDialogChannel && onUpdateChannel) {
      const currentConfig = normalizedChannels[activeDialogChannel] || { enabled: false };
      onUpdateChannel(activeDialogChannel, {
        ...currentConfig,
        details: channelDetails
      });
      setActiveDialogChannel(null);
    }
  };

  if (readonly) {
    // Display-only mode for channels that are enabled
    const enabledChannels = Object.entries(normalizedChannels)
      .filter(([_, config]) => config.enabled)
      .map(([channel]) => channel);
    
    if (!enabledChannels.length) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {enabledChannels.map((channel) => {
          const info = CHANNEL_INFO[channel];
          return (
            <Badge 
              key={channel}
              className={`${info.bgColor} text-white px-2 py-1 flex items-center gap-1`}
              variant="default"
            >
              {info.icon}
              <span className="text-[0.65rem] capitalize">{channel}</span>
            </Badge>
          );
        })}
      </div>
    );
  }

  // Interactive channel configuration mode
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      {ALL_CHANNELS.map((channel) => {
        const channelConfig = normalizedChannels[channel];
        const info = CHANNEL_INFO[channel];
        
        return (
          <div 
            key={channel}
            className="bg-black/40 rounded-lg border border-gray-800 p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className={info.color}>{info.icon}</span>
                <span className="font-medium text-white">{info.name}</span>
              </div>
              <Switch
                checked={channelConfig.enabled}
                onCheckedChange={(checked) => handleToggleChannel(channel, checked)}
              />
            </div>
            
            {channelConfig.details ? (
              <p className="text-sm text-gray-400 mb-4 truncate">{channelConfig.details}</p>
            ) : (
              <p className="text-sm text-gray-500 mb-4 italic">No configuration</p>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="mt-auto bg-transparent border-gray-700 hover:bg-gray-800 text-white"
                  onClick={() => handleOpenConfigDialog(channel)}
                >
                  Configure
                </Button>
              </DialogTrigger>
              
              {activeDialogChannel === channel && (
                <DialogContent className="sm:max-w-md bg-black text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className={info.color}>{info.icon}</span>
                      Configure {info.name}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${channel}-details`}>
                        {channel === 'voice' || channel === 'sms' || channel === 'whatsapp' 
                          ? 'Phone Number' 
                          : channel === 'chat' 
                            ? 'URL' 
                            : 'Email Address'}
                      </Label>
                      <Input
                        id={`${channel}-details`}
                        placeholder={info.placeholder}
                        value={channelDetails}
                        onChange={(e) => setChannelDetails(e.target.value)}
                        className="bg-black/30 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveDialogChannel(null)}
                      className="bg-transparent border-gray-700 hover:bg-gray-800 text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveConfig}
                      className="bg-agent-primary hover:bg-agent-primary/90"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </div>
        );
      })}
    </div>
  );
};
