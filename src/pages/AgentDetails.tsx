
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { AgentToggle } from "@/components/AgentToggle";
import { AgentChannels } from "@/components/AgentChannels";
import { AgentStats } from "@/components/AgentStats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart4, Bot, Calendar, Clipboard, Copy, Edit, Loader2, Mail, Phone, UserCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { agent, isLoading, error } = useAgentDetails(agentId);
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied`,
      description: `The ${type.toLowerCase()} has been copied to clipboard.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-agent-primary animate-spin" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <h2 className="text-2xl font-semibold text-foreground dark:text-white">Error Loading Agent</h2>
        <p className="text-muted-foreground dark:text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`} alt={agent.name} />
            <AvatarFallback>
              <Bot className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold text-foreground dark:text-white tracking-tight">
                {agent.name}
              </h1>
              <Badge variant={agent.status === "active" ? "default" : "secondary"} className="ml-2">
                {agent.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground dark:text-gray-300 mt-1 max-w-2xl">
              {agent.description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          <Link to={`/agents/${agentId}/analytics`}>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Logs
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Agent
          </Button>
          
          <AgentToggle 
            isActive={agent.status === "active"} 
            onToggle={() => {}} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentStats 
              avmScore={agent.avmScore || 7.8} 
              interactionCount={agent.interactions || 0}
              csat={agent.csat}
              performance={agent.performance}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agent.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{agent.phone}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => handleCopyToClipboard(agent.phone || '', 'Phone Number')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {agent.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{agent.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => handleCopyToClipboard(agent.email || '', 'Email Address')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              <span>Created by John Doe</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created on {agent.createdAt || "Jan 15, 2023"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>Active channels for this agent</CardDescription>
          </CardHeader>
          <CardContent>
            <AgentChannels 
              channels={agent.channelConfigs || {}} 
              readonly={true} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDetails;
