
import React from "react";
import { 
  Mic, BookOpen, Workflow, FlaskConical, CheckCircle2, 
  Upload, PlayCircle, Bot, File, CircleDashed, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AgentStats } from "./AgentStats";
import { AgentChannels } from "./AgentChannels";

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  progress?: number;
  children?: React.ReactNode;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ 
  title, 
  description, 
  icon, 
  isActive, 
  isCompleted, 
  progress = 0,
  children,
  stepNumber
}) => {
  return (
    <Card className={`mb-6 ${isActive ? 'border-primary/50 shadow-md' : 'border-gray-100 dark:border-gray-800'} dark:bg-agent-dark-bg dark:text-white`}>
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className={`p-2 rounded-full flex items-center justify-center ${
          isCompleted 
            ? 'bg-green-100 dark:bg-green-900/20' 
            : isActive 
              ? 'bg-primary/10' 
              : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <div className="h-5 w-5 flex items-center justify-center text-gray-900 dark:text-white">
              {stepNumber}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
            {progress > 0 && progress < 100 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
            )}
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">{description}</CardDescription>
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
            <span className="text-sm font-medium mr-2 text-gray-700 dark:text-gray-300">{overallProgress}% Complete</span>
            <Progress value={overallProgress} className="w-24 h-2" />
          </div>
        </div>
        
        {/* Next Action Recommendation */}
        <div className="bg-primary/10 rounded-lg p-4 mb-6 dark:bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-2 rounded-full dark:bg-primary/10">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base mb-1 text-gray-900 dark:text-white">Recommended Next Action</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete your agent training by uploading call recordings or starting a role-play conversation.
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          Complete these steps in order to fully configure your agent for optimal performance
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
          icon={<Mic className="h-5 w-5 text-primary" />}
          isActive={steps.training.active}
          isCompleted={steps.training.completed}
          progress={steps.training.progress}
          stepNumber={1}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">3/10</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Voice Samples</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">65%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Voice Cloning Confidence</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">45s</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Average Talk Time</div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Progress: 3 of 10 voice samples uploaded</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Upload 7 more voice samples to complete this step.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-4 mb-4 dark:bg-primary/5">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Get Started with Training</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Choose one of the following options to begin training your AI agent:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2 dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
                <Upload className="h-4 w-4" />
                <span>Upload Call Recordings</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2 dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
                <PlayCircle className="h-4 w-4" />
                <span>Start Role-Playing</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2 dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
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
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          isActive={steps.knowledge.active}
          isCompleted={steps.knowledge.completed}
          progress={steps.knowledge.progress}
          stepNumber={2}
        >
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                <ArrowRight className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Status: Partially complete</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">You've added some knowledge, but we recommend adding more documents to improve your agent's accuracy.</p>
              </div>
            </div>
          </div>
        
          <div className="bg-primary/5 rounded-lg p-4 mb-4 dark:bg-primary/5">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Add Knowledge Sources</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Select a method to provide training data for your agent:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2 dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
                <File className="h-4 w-4" />
                <span>Add Web Page</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2 dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
                <Upload className="h-4 w-4" />
                <span>Upload Documents</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2 dark:bg-agent-dark-bg dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
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
          icon={<Workflow className="h-5 w-5 text-primary" />}
          isActive={steps.workflow.active}
          isCompleted={steps.workflow.completed}
          progress={steps.workflow.progress}
          stepNumber={3}
        >
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-700/20 p-2 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Status: Not started</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  You'll need to complete the Knowledge Base step before designing your workflow.
                </p>
              </div>
            </div>
          </div>
          
          {/* Adding Channel Configuration Section */}
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800/50 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-white font-medium">Channel Configuration</span>
            </div>
            {agent.onUpdateChannel && (
              <AgentChannels 
                channels={agent.channelConfigs} 
                onUpdateChannel={agent.onUpdateChannel} 
              />
            )}
          </div>
        </Step>
        
        {/* Simulation Step */}
        <Step 
          title="Simulations" 
          description="Test your agent's performance through different scenarios"
          icon={<FlaskConical className="h-5 w-5 text-primary" />}
          isActive={steps.simulation.active}
          isCompleted={steps.simulation.completed}
          progress={steps.simulation.progress}
          stepNumber={4}
        >
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-700/20 p-2 rounded-full">
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Status: Not started</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  You'll need to complete the Workflow step before running simulations.
                </p>
              </div>
            </div>
          </div>
        </Step>
      </div>
    </div>
  );
};
