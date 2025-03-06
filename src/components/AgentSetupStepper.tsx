
import React from "react";
import { 
  Mic, BookOpen, Workflow, FlaskConical, CheckCircle2, 
  Upload, PlayCircle, Bot, File, CircleDashed
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AgentStats } from "./AgentStats";

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  progress?: number;
  children?: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ 
  title, 
  description, 
  icon, 
  isActive, 
  isCompleted, 
  progress = 0,
  children 
}) => {
  return (
    <Card className={`mb-6 border ${isActive ? 'border-agent-primary/50 shadow-md' : 'border-gray-100 dark:border-gray-800'}`}>
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100 dark:bg-green-900/20' : isActive ? 'bg-agent-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <div className="h-5 w-5 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {progress > 0 && progress < 100 && (
              <span className="text-sm text-gray-500">{progress}%</span>
            )}
          </div>
          <CardDescription>{description}</CardDescription>
          {progress > 0 && (
            <Progress value={progress} className="h-1.5 mt-2" />
          )}
        </div>
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

interface AgentSetupStepperProps {
  agent: any;
}

export const AgentSetupStepper: React.FC<AgentSetupStepperProps> = ({ agent }) => {
  // In a real application, these would come from agent data
  const steps = {
    training: { completed: false, progress: 30, active: true },
    knowledge: { completed: false, progress: 15, active: false },
    workflow: { completed: false, progress: 0, active: false },
    simulation: { completed: false, progress: 0, active: false }
  };
  
  // Calculate overall setup progress
  const totalSteps = Object.keys(steps).length;
  const completedSteps = Object.values(steps).filter(step => step.completed).length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Setup</h2>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{overallProgress}% Complete</span>
            <Progress value={overallProgress} className="w-24 h-2" />
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Complete these steps to fully configure your agent for optimal performance
        </p>
      </div>
      
      <div className="space-y-1">
        <AgentStats 
          avmScore={agent.avmScore || 6.5} 
          interactionCount={agent.interactions || 0} 
        />
      </div>

      <div className="space-y-4 mt-8">
        {/* Training Step */}
        <Step 
          title="Agent Training" 
          description="Train your voice agent by uploading call recordings or role-play a conversation"
          icon={<Mic className="h-5 w-5 text-agent-primary" />}
          isActive={steps.training.active}
          isCompleted={steps.training.completed}
          progress={steps.training.progress}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold">3/10</div>
              <div className="text-xs text-gray-500">Voice Samples</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold">65%</div>
              <div className="text-xs text-gray-500">Voice Cloning Confidence</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold">45s</div>
              <div className="text-xs text-gray-500">Average Talk Time</div>
            </div>
          </div>
          
          <div className="bg-agent-primary/5 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Get Started with Training</h4>
            <p className="text-sm text-gray-500 mb-4">Choose one of the following options to begin training your AI agent:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Call Recordings</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <PlayCircle className="h-4 w-4" />
                <span>Start Role-Playing</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Bot className="h-4 w-4" />
                <span>Hire Voice Actor</span>
              </Button>
            </div>
          </div>
        </Step>
        
        {/* Knowledge Base Step */}
        <Step 
          title="Knowledge Base" 
          description="Upload documents to give your agent its specific knowledge"
          icon={<BookOpen className="h-5 w-5 text-agent-primary" />}
          isActive={steps.knowledge.active}
          isCompleted={steps.knowledge.completed}
          progress={steps.knowledge.progress}
        >
          <div className="bg-agent-primary/5 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Add Knowledge Sources</h4>
            <p className="text-sm text-gray-500 mb-4">Select a method to provide training data for your agent:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <File className="h-4 w-4" />
                <span>Add Web Page</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Documents</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <CircleDashed className="h-4 w-4" />
                <span>Add Text</span>
              </Button>
            </div>
          </div>
        </Step>
        
        {/* Workflow Step */}
        <Step 
          title="Workflow" 
          description="Design and automate your agent's conversation flow"
          icon={<Workflow className="h-5 w-5 text-agent-primary" />}
          isActive={steps.workflow.active}
          isCompleted={steps.workflow.completed}
          progress={steps.workflow.progress}
        />
        
        {/* Simulation Step */}
        <Step 
          title="Simulations" 
          description="Test your agent's performance through different scenarios"
          icon={<FlaskConical className="h-5 w-5 text-agent-primary" />}
          isActive={steps.simulation.active}
          isCompleted={steps.simulation.completed}
          progress={steps.simulation.progress}
        />
      </div>
    </div>
  );
};
