
import React from "react";
import { Mic, MessageCircle, Smartphone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentChannelsProps {
  channels?: string[];
}

export const AgentChannels: React.FC<AgentChannelsProps> = ({ channels = [] }) => {
  if (!channels.length) return null;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "voice":
        return <Mic className="h-3 w-3" />;
      case "chat":
        return <MessageCircle className="h-3 w-3" />;
      case "sms":
        return <Smartphone className="h-3 w-3" />;
      case "email":
        return <Mail className="h-3 w-3" />;
      case "whatsapp":
        return <MessageCircle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getChannelColor = (channel: string) => {
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

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <TooltipProvider>
        {channels.map((channel) => (
          <Tooltip key={channel}>
            <TooltipTrigger asChild>
              <Badge 
                className={`${getChannelColor(channel)} text-white text-xs px-2 py-0.5 flex items-center gap-1`}
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
};
