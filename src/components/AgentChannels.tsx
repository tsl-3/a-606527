
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Phone, Mail, MessageSquare, AlertCircle, X, AlertTriangle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AgentChannelConfig, AgentType } from "@/types/agent";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface AgentChannelsProps {
  agent?: AgentType;
  channels?: Record<string, AgentChannelConfig>;
  onUpdateChannel?: (
    channel: string,
    config: {
      enabled: boolean;
      details?: string;
      config?: Record<string, any>;
    }
  ) => void;
  readonly?: boolean;
  compact?: boolean;
  className?: string;
}

export const AgentChannels: React.FC<AgentChannelsProps> = ({
  agent,
  channels: propChannels,
  onUpdateChannel,
  readonly = false,
  compact = false,
  className = ""
}) => {
  // Use either direct props or extract from agent object
  const channels: Record<string, AgentChannelConfig> = propChannels || agent?.channelConfigs || {};
  
  const [voiceNumber, setVoiceNumber] = useState<string>(channels?.voice?.details || "");
  const [emailAddress, setEmailAddress] = useState<string>(channels?.email?.details || "");
  const [chatUsername, setChatUsername] = useState<string>(channels?.chat?.details || "");
  
  const handleToggleChannel = (channel: string, enabled: boolean) => {
    if (readonly || !onUpdateChannel) return;
    
    let details = "";
    switch (channel) {
      case "voice":
        details = voiceNumber;
        break;
      case "email":
        details = emailAddress;
        break;
      case "chat":
        details = chatUsername;
        break;
    }
    
    onUpdateChannel(channel, {
      enabled,
      details,
      config: channels[channel]?.config || {}
    });
  };
  
  const handleDetailsChange = (channel: string, value: string) => {
    if (readonly) return;
    
    switch (channel) {
      case "voice":
        setVoiceNumber(value);
        break;
      case "email":
        setEmailAddress(value);
        break;
      case "chat":
        setChatUsername(value);
        break;
    }
  };
  
  const handleSaveDetails = (channel: string) => {
    if (readonly || !onUpdateChannel) return;
    
    let details = "";
    switch (channel) {
      case "voice":
        details = voiceNumber;
        break;
      case "email":
        details = emailAddress;
        break;
      case "chat":
        details = chatUsername;
        break;
    }
    
    onUpdateChannel(channel, {
      enabled: channels[channel]?.enabled || false,
      details,
      config: channels[channel]?.config || {}
    });
  };
  
  if (readonly && compact) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Object.entries(channels).map(([channel, config]) => {
          if (!config.enabled) return null;
          
          let icon = null;
          let color = "";
          
          switch (channel) {
            case "voice":
              icon = <Phone className="h-3 w-3 mr-1" />;
              color = "text-blue-500";
              break;
            case "email":
              icon = <Mail className="h-3 w-3 mr-1" />;
              color = "text-red-500";
              break;
            case "chat":
              icon = <MessageSquare className="h-3 w-3 mr-1" />;
              color = "text-purple-500";
              break;
          }
          
          return (
            <Badge key={channel} variant="outline" className={`border border-gray-200 dark:border-gray-800 ${color}`}>
              {icon}
              <span className="text-xs capitalize">{channel}</span>
            </Badge>
          );
        })}
      </div>
    );
  }
  
  return (
    <Card className={`border border-gray-200 dark:border-gray-800 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Communication Channels</CardTitle>
        <CardDescription>Configure how customers can interact with this agent</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Voice Channel */}
        <div className={`p-4 border rounded-lg ${channels.voice?.enabled ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800" : "bg-gray-50/50 dark:bg-gray-900/20 border-gray-200/50 dark:border-gray-800/50"}`}>
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              <div className={`p-1.5 rounded-full ${channels.voice?.enabled ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"}`}>
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Voice Channel</h3>
                <p className="text-xs text-muted-foreground">Allow users to call your agent</p>
              </div>
            </div>
            
            {!readonly && (
              <Switch
                checked={channels.voice?.enabled || false}
                onCheckedChange={(checked) => handleToggleChannel("voice", checked)}
              />
            )}
          </div>
          
          {channels.voice?.enabled && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">
                  Enter the phone number customers will call to reach this agent
                </span>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter phone number"
                    value={voiceNumber}
                    onChange={(e) => handleDetailsChange("voice", e.target.value)}
                    disabled={readonly}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>
                
                {!readonly && (
                  <Button onClick={() => handleSaveDetails("voice")} size="sm">
                    Save
                  </Button>
                )}
              </div>
              
              {channels.voice?.details && (
                <div className="flex items-center gap-2 mt-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{channels.voice.details}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Email Channel */}
        <div className={`p-4 border rounded-lg ${channels.email?.enabled ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800" : "bg-gray-50/50 dark:bg-gray-900/20 border-gray-200/50 dark:border-gray-800/50"}`}>
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              <div className={`p-1.5 rounded-full ${channels.email?.enabled ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"}`}>
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Email Channel</h3>
                <p className="text-xs text-muted-foreground">Allow users to email your agent</p>
              </div>
            </div>
            
            {!readonly && (
              <Switch
                checked={channels.email?.enabled || false}
                onCheckedChange={(checked) => handleToggleChannel("email", checked)}
              />
            )}
          </div>
          
          {channels.email?.enabled && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-red-500" />
                <span className="text-xs text-muted-foreground">
                  Enter the email address customers will use to contact this agent
                </span>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter email address"
                    value={emailAddress}
                    onChange={(e) => handleDetailsChange("email", e.target.value)}
                    disabled={readonly}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>
                
                {!readonly && (
                  <Button onClick={() => handleSaveDetails("email")} size="sm">
                    Save
                  </Button>
                )}
              </div>
              
              {channels.email?.details && (
                <div className="flex items-center gap-2 mt-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{channels.email.details}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Chat Channel */}
        <div className={`p-4 border rounded-lg ${channels.chat?.enabled ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800" : "bg-gray-50/50 dark:bg-gray-900/20 border-gray-200/50 dark:border-gray-800/50"}`}>
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              <div className={`p-1.5 rounded-full ${channels.chat?.enabled ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"}`}>
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Chat Channel</h3>
                <p className="text-xs text-muted-foreground">Allow users to chat with your agent</p>
              </div>
            </div>
            
            {!readonly && (
              <Switch
                checked={channels.chat?.enabled || false}
                onCheckedChange={(checked) => handleToggleChannel("chat", checked)}
              />
            )}
          </div>
          
          {channels.chat?.enabled && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">
                  Configure a chat username or identifier (optional)
                </span>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter username (optional)"
                    value={chatUsername}
                    onChange={(e) => handleDetailsChange("chat", e.target.value)}
                    disabled={readonly}
                    className="bg-white dark:bg-gray-900"
                  />
                </div>
                
                {!readonly && (
                  <Button onClick={() => handleSaveDetails("chat")} size="sm">
                    Save
                  </Button>
                )}
              </div>
              
              {channels.chat?.details && (
                <div className="flex items-center gap-2 mt-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{channels.chat.details}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
