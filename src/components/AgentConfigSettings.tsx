
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AgentType } from '@/types/agent';
import { useToast } from "@/components/ui/use-toast";
import { updateAgent } from '@/services/agentService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Copy, Save, Target, User, FileText, Code, Building, Briefcase } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentConfigSettingsProps {
  agent: AgentType;
  onAgentUpdate: (updatedAgent: AgentType) => void;
}

const INDUSTRIES = [
  { id: "healthcare", name: "Healthcare" },
  { id: "finance", name: "Finance & Banking" },
  { id: "retail", name: "Retail & E-commerce" },
  { id: "technology", name: "Technology & Software" },
  { id: "education", name: "Education" },
  { id: "hospitality", name: "Hospitality & Travel" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "insurance", name: "Insurance" },
  { id: "telecommunications", name: "Telecommunications" },
  { id: "real-estate", name: "Real Estate" }
];

const BOT_FUNCTIONS = [
  { id: "customer-service", name: "Customer Service" },
  { id: "sales", name: "Sales & Marketing" },
  { id: "support", name: "Technical Support" },
  { id: "it-helpdesk", name: "IT Helpdesk" },
  { id: "lead-generation", name: "Lead Generation" },
  { id: "booking", name: "Appointment Booking" },
  { id: "faq", name: "FAQ & Knowledge Base" },
  { id: "onboarding", name: "Customer Onboarding" },
  { id: "billing", name: "Billing & Payments" },
  { id: "feedback", name: "Feedback Collection" }
];

const AgentConfigSettings: React.FC<AgentConfigSettingsProps> = ({ agent, onAgentUpdate }) => {
  const { toast } = useToast();
  const [name, setName] = useState(agent.name);
  const [avatar, setAvatar] = useState(agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`);
  const [purpose, setPurpose] = useState(agent.purpose || '');
  const [prompt, setPrompt] = useState(agent.prompt || '');
  const [industry, setIndustry] = useState(agent.industry || '');
  const [botFunction, setBotFunction] = useState(agent.botFunction || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedAgent = await updateAgent(agent.id, {
        name,
        avatar,
        purpose,
        prompt,
        industry,
        botFunction
      });
      
      onAgentUpdate(updatedAgent);
      
      toast({
        title: "Settings saved",
        description: "Agent configuration has been updated successfully."
      });
    } catch (error) {
      console.error("Error saving agent settings:", error);
      toast({
        title: "Failed to save settings",
        description: "There was an error saving the agent configuration.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Agent Configuration</CardTitle>
        <CardDescription>
          Configure your agent's basic information and behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-agent-primary" />
                  <Label htmlFor="agent-industry">Industry</Label>
                </div>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="agent-industry" className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The industry context your agent operates in
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-agent-primary" />
                  <Label htmlFor="agent-function">Bot Function</Label>
                </div>
                <Select value={botFunction} onValueChange={setBotFunction}>
                  <SelectTrigger id="agent-function" className="w-full">
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {BOT_FUNCTIONS.map((func) => (
                      <SelectItem key={func.id} value={func.id}>{func.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The primary function your agent serves
                </p>
              </div>
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

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-4 w-4 text-agent-primary" />
            <Label htmlFor="agent-prompt" className="text-lg font-medium">Agent Prompt Instructions</Label>
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
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            These instructions tell the AI how to behave, what knowledge to use, and what tone to adopt
          </p>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving} className="px-6">
            {isSaving ? (
              <>Loading...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentConfigSettings;
