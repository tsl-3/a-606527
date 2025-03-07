
import React from "react";
import { Mic, MessageSquare, Smartphone, Mail, MessageCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentChannelsProps {
  channels?: string[];
  onToggleChannel?: (channel: string) => void;
  readonly?: boolean;
}

// All available channels
const ALL_CHANNELS = ["voice", "chat", "sms", "email", "whatsapp"];

export const AgentChannels: React.FC<AgentChannelsProps> = ({ 
  channels = [], 
  onToggleChannel,
  readonly = false
}) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "voice":
        return <Mic className="h-3 w-3" />;
      case "chat":
        return <MessageSquare className="h-3 w-3" />;
      case "sms":
        return <Smartphone className="h-3 w-3" />;
      case "email":
        return <Mail className="h-3 w-3" />;
      case "whatsapp":
        return <MessageCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getChannelColor = (channel: string, active: boolean) => {
    if (!active) return "bg-gray-800 hover:bg-gray-700 text-gray-400";
    
    switch (channel) {
      case "voice":
        return "bg-blue-500 hover:bg-blue-600";
      case "chat":
        return "bg-purple-500 hover:bg-purple-600";
      case "sms":
        return "bg-orange-500 hover:bg-orange-600";
      case "email":
        return "bg-red-500 hover:bg-red-600";
      case "whatsapp":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (readonly) {
    // Original display-only mode
    if (!channels.length) return null;
    
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        <TooltipProvider>
          {channels.map((channel) => (
            <Tooltip key={channel}>
              <TooltipTrigger asChild>
                <Badge 
                  className={`${getChannelColor(channel, true)} text-white text-xs px-2 py-0.5 flex items-center gap-1`}
                  variant="default"
                >
                  {getChannelIcon(channel)}
                  <span className="text-[0.65rem] capitalize">{channel}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{channel} channel</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    );
  }

  // Interactive selection mode
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <TooltipProvider>
        {ALL_CHANNELS.map((channel) => {
          const isActive = channels.includes(channel);
          
          return (
            <Tooltip key={channel}>
              <TooltipTrigger asChild>
                <Badge 
                  className={`${getChannelColor(channel, isActive)} text-xs px-2 py-0.5 flex items-center gap-1 cursor-pointer transition-colors duration-200`}
                  variant="default"
                  onClick={() => onToggleChannel && onToggleChannel(channel)}
                >
                  {getChannelIcon(channel)}
                  <span className="text-[0.65rem] capitalize">{channel}</span>
                  {isActive && <Check className="h-2 w-2 ml-0.5" />}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{isActive ? "Disable" : "Enable"} {channel} channel</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};
