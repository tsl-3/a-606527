
import React, { useState } from "react";
import { 
  Mic, BookOpen, Workflow, FlaskConical, CheckCircle2, 
  Upload, PlayCircle, Bot, File, CircleDashed, ArrowRight,
  Clock, BarChart, ChevronUp, Download, Trash2, User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AgentChannels } from "./AgentChannels";

// Define training record interface
interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
}

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

// New Training Card Component
const AgentTrainingCard: React.FC<{ 
  status: 'empty' | 'in-progress' | 'completed';
  voiceSamples?: number;
  totalSamples?: number;
  voiceConfidence?: number;
  talkTime?: string;
  trainingRecords?: TrainingRecord[];
}> = ({ 
  status, 
  voiceSamples = 0, 
  totalSamples = 10, 
  voiceConfidence = 0,
  talkTime = '0s',
  trainingRecords = []
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-[#1A1F2C] rounded-lg overflow-hidden mb-6">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-agent-primary rounded-full"></div>
            <h3 className="text-xl font-semibold text-white">Agent Training</h3>
            {status !== 'empty' && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 ml-2">
                In Progress
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronUp className={`h-5 w-5 ${!isExpanded ? 'transform rotate-180' : ''}`} />
          </Button>
        </div>
        
        {isExpanded && (
          <>
            <p className="text-gray-300 mb-8 max-w-4xl">
              Start training your voice agent by uploading call recordings or role-play a conversation to clone your voice, patterns, behaviors, and personality.
            </p>

            {status === 'empty' && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mb-8 text-center">
                <Mic className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-200 mb-2">No voice samples yet</h4>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Upload call recordings or start a role-playing session to begin training your agent.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Recordings
                  </Button>
                  <Button className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Start Role-Play
                  </Button>
                </div>
              </div>
            )}

            {status !== 'empty' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-black/30 p-6 rounded-lg border border-gray-800/50 flex flex-col">
                  <div className="flex items-center gap-2 mb-1 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Voice Samples</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="text-3xl font-bold text-white">{voiceSamples}/{totalSamples}</div>
                    <div className="text-xs text-gray-500">Recommended samples for optimal training</div>
                  </div>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-gray-800/50 flex flex-col">
                  <div className="flex items-center gap-2 mb-1 text-gray-400">
                    <BarChart className="h-4 w-4" />
                    <span className="text-xs font-medium">Voice Cloning Confidence</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="text-3xl font-bold text-white">{voiceConfidence}%</div>
                    <div className="text-xs text-gray-500">Current confidence level: {
                      voiceConfidence < 40 ? 'low' : voiceConfidence < 70 ? 'medium' : 'high'
                    }</div>
                  </div>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-gray-800/50 flex flex-col">
                  <div className="flex items-center gap-2 mb-1 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Average Talk Time</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="text-3xl font-bold text-white">{talkTime}</div>
                    <div className="text-xs text-gray-500">Average duration of voice samples</div>
                  </div>
                </div>
              </div>
            )}

            {status !== 'empty' && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <span>Voice Sample Collection</span>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 ml-1">
                        In Progress
                      </Badge>
                    </h4>
                    <span className="text-gray-400 text-sm">{voiceConfidence}%</span>
                  </div>
                  <div className="relative mb-2">
                    <Progress value={voiceConfidence} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Optimal (5)</span>
                    <span>Ideal (10)</span>
                    <span>Best (20+)</span>
                  </div>
                </div>

                <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-6 mb-6">
                  <h4 className="font-medium text-white mb-3">Get Started with Training</h4>
                  <p className="text-sm text-gray-400 mb-4">Choose one of the following options to begin training your AI agent:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="flex items-center justify-center gap-2 bg-black/30 border-gray-800 text-white hover:bg-gray-800">
                      <Upload className="h-4 w-4" />
                      <span>Upload Call Recordings</span>
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2 bg-black/30 border-gray-800 text-white hover:bg-gray-800">
                      <PlayCircle className="h-4 w-4" />
                      <span>Start Role-Playing</span>
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2 bg-black/30 border-gray-800 text-white hover:bg-gray-800">
                      <Bot className="h-4 w-4" />
                      <span>Hire Voice Actor</span>
                    </Button>
                  </div>
                </div>

                {trainingRecords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-4">Training Recordings</h4>
                    <div className="space-y-2">
                      {trainingRecords.map((record) => (
                        <div key={record.id} className="bg-black/30 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-800 p-2 rounded-full">
                              {record.type === 'call' ? (
                                <Mic className="h-5 w-5 text-gray-400" />
                              ) : (
                                <User className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-white">{record.title}</h5>
                              <p className="text-xs text-gray-500">{record.date}, {record.time} • {record.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
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

  // Sample training records - would come from backend in real app
  const sampleTrainingRecords: TrainingRecord[] = [
    {
      id: '1',
      title: 'Customer Support Call #1',
      date: 'Feb 20, 2024',
      time: '8:30 AM',
      duration: '5:30',
      type: 'call'
    },
    {
      id: '2',
      title: 'Role-Play Session #1',
      date: 'Feb 21, 2024',
      time: '3:15 AM',
      duration: '3:45',
      type: 'roleplay'
    }
  ];
  
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
      
      <div className="space-y-4 mt-8">
        {/* Empty State Training Example */}
        <AgentTrainingCard status="empty" />
        
        {/* In Progress Training Example - uncomment this to see the in-progress state */}
        <AgentTrainingCard 
          status="in-progress" 
          voiceSamples={3} 
          voiceConfidence={65} 
          talkTime="45s" 
          trainingRecords={sampleTrainingRecords}
        />
        
        {/* Training Step - Original (can be removed once the new design is approved) */}
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
