import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  FileAudio,
  FileText,
  Mail,
  MessageSquare,
  PlusCircle,
  Trash2,
  Upload,
  User,
  Users,
  UserRound,
  Volume2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonasCard } from "@/components/PersonasCard";
import { SimulationCard } from "@/components/SimulationCard";

interface AgentSetupStepperProps {
  onComplete: (data: any) => void;
}

const STEPS = [
  "Agent Details",
  "Define Personas",
  "Setup Simulations",
  "Review & Launch",
];

const channelOptions = [
  { value: "voice", label: "Voice", icon: Volume2 },
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "email", label: "Email", icon: Mail },
];

const personaExamples = [
  {
    name: "Sarah",
    role: "Customer Service Representative",
    age: "25",
    description: "Sarah is a friendly and helpful customer service representative who is passionate about helping customers resolve their issues.",
  },
  {
    name: "David",
    role: "Technical Support Specialist",
    age: "32",
    description: "David is a knowledgeable and experienced technical support specialist who is able to troubleshoot complex technical issues.",
  },
  {
    name: "Emma",
    role: "Team Lead",
    age: "28",
    description: "Emma manages a team of support representatives. She's focused on improving customer satisfaction and reducing resolution times.",
  },
];

export const AgentSetupStepper: React.FC<AgentSetupStepperProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [agentPurpose, setAgentPurpose] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [voiceChannelDetails, setVoiceChannelDetails] = useState("");
  const [chatChannelDetails, setChatChannelDetails] = useState("");
  const [emailChannelDetails, setEmailChannelDetails] = useState("");
  const [recordings, setRecordings] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [selectedSimulations, setSelectedSimulations] = useState<string[]>([]);
  const [simulationCount, setSimulationCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [simulationsGenerated, setSimulationsGenerated] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [personasStatus, setPersonasStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [simulationStatus, setSimulationStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [personasGeneratedCount, setPersonasGeneratedCount] = useState(0);
  const [personasTotalCount, setPersonasTotalCount] = useState(10);
  const [personas, setPersonas] = useState<any[]>([]);
  const [simulationsCoverage, setSimulationsCoverage] = useState(0);
  const [simulationsPerformance, setSimulationsPerformance] = useState(0);
  const [simulationsScenarios, setSimulationsScenarios] = useState<any[]>([]);
  const [simulationsList, setSimulationsList] = useState<any[]>([]);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete({
        agentName,
        agentPurpose,
        selectedChannels,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Details</CardTitle>
                <CardDescription>
                  Provide basic information about your agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Agent Purpose</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the agent's purpose"
                    value={agentPurpose}
                    onChange={(e) => setAgentPurpose(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Configuration</CardTitle>
                <CardDescription>
                  Select the channels your agent will operate on.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    {channelOptions.map((channel) => (
                      <Badge
                        key={channel.value}
                        variant={
                          selectedChannels.includes(channel.value)
                            ? "default"
                            : "secondary"
                        }
                        onClick={() => handleChannelToggle(channel.value)}
                        className="cursor-pointer"
                      >
                        <channel.icon className="h-4 w-4 mr-2" />
                        {channel.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedChannels.includes("voice") && (
                  <div className="grid gap-2">
                    <Label htmlFor="voiceDetails">Voice Channel Details</Label>
                    <Input
                      id="voiceDetails"
                      placeholder="Enter phone number"
                      value={voiceChannelDetails}
                      onChange={(e) => setVoiceChannelDetails(e.target.value)}
                    />
                  </div>
                )}

                {selectedChannels.includes("chat") && (
                  <div className="grid gap-2">
                    <Label htmlFor="chatDetails">Chat Channel Details</Label>
                    <Input
                      id="chatDetails"
                      placeholder="Enter chat URL"
                      value={chatChannelDetails}
                      onChange={(e) => setChatChannelDetails(e.target.value)}
                    />
                  </div>
                )}

                {selectedChannels.includes("email") && (
                  <div className="grid gap-2">
                    <Label htmlFor="emailDetails">Email Channel Details</Label>
                    <Input
                      id="emailDetails"
                      placeholder="Enter email address"
                      value={emailChannelDetails}
                      onChange={(e) => setEmailChannelDetails(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 1:
        return (
          <PersonasCard 
            status={personasStatus}
            personas={personas}
            generatedCount={personasGeneratedCount}
            totalCount={personasTotalCount}
          />
        );
      case 2:
        return (
          <SimulationCard 
            status={simulationStatus}
            coverage={simulationsCoverage}
            performance={simulationsPerformance}
            scenarios={simulationsScenarios}
            simulations={simulationsList}
          />
        );
      case 3:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Review and Launch</CardTitle>
                <CardDescription>
                  Review your agent details and launch your agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Agent Name</Label>
                  <p className="text-sm font-medium">{agentName}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Agent Purpose</Label>
                  <p className="text-sm font-medium">{agentPurpose}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedChannels.map((channel) => (
                      <Badge key={channel} variant="default">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return agentName.trim().length > 0 && agentPurpose.trim().length > 0;
    }
    return true;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agent Setup</h2>
        <p className="text-muted-foreground">
          Configure your agent in a few easy steps.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {STEPS.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center">
                <div className="rounded-full border-2 flex items-center justify-center w-8 h-8">
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="ml-2 text-sm font-medium">{step}</div>
              </div>
              {index < STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
        <Progress value={((currentStep + 1) / STEPS.length) * 100} />
      </div>

      <div>{renderStepContent()}</div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {currentStep === STEPS.length - 1 ? "Launch Agent" : "Next"}
        </Button>
      </div>
    </div>
  );
};
