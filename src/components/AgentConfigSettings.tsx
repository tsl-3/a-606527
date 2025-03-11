
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
import { 
  Bot, Copy, Save, Target, User, FileText, Code, Building, Briefcase, 
  Headphones, ShoppingCart, Wrench, CircuitBoard, GraduationCap, Plane, 
  Factory, ShieldCheck, Phone, Home, Plus, CirclePlus, MessageSquare,
  HeartPulse, Landmark, Wallet, HelpCircle, BarChart4, Pen, Calendar
} from 'lucide-react';

interface AgentConfigSettingsProps {
  agent: AgentType;
  onAgentUpdate: (updatedAgent: AgentType) => void;
}

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

const AgentConfigSettings: React.FC<AgentConfigSettingsProps> = ({ agent, onAgentUpdate }) => {
  const { toast } = useToast();
  const [name, setName] = useState(agent.name);
  const [avatar, setAvatar] = useState(agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`);
  const [purpose, setPurpose] = useState(agent.purpose || '');
  const [prompt, setPrompt] = useState(agent.prompt || '');
  const [industry, setIndustry] = useState(agent.industry || '');
  const [botFunction, setBotFunction] = useState(agent.botFunction || '');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customFunction, setCustomFunction] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const finalIndustry = industry === 'other' ? customIndustry : industry;
      const finalBotFunction = botFunction === 'other' ? customFunction : botFunction;
      
      const updatedAgent = await updateAgent(agent.id, {
        name,
        avatar,
        purpose,
        prompt,
        industry: finalIndustry,
        botFunction: finalBotFunction
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

        <div className="space-y-4 pt-6 border-t">
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

          <div className="space-y-3 pt-4">
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
