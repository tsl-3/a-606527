import React, { useState, useRef } from "react";
import { 
  BookOpen, Workflow, FlaskConical, CheckCircle2, 
  Upload, PlayCircle, Bot, File, CircleDashed, ArrowRight,
  Clock, BarChart, ChevronUp, Download, Trash2, User, Mic,
  Users, UserRound, MessageCircle, Brain, Search, Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AgentChannels } from "./AgentChannels";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { PersonasCard } from "./PersonasCard";
import { WorkflowCard } from "./WorkflowCard";
import { SimulationCard } from "./SimulationCard";
import { RolePlayDialog } from "./RolePlayDialog";
import { useToast } from "@/hooks/use-toast";

interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
}

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  format?: string;
}

interface Persona {
  id: string;
  name: string;
  role: string;
  age: string;
  description: string;
  pain_points: string[];
  goals: string[];
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
    <Card className={`mb-6 ${isActive ? 'border-primary/50 shadow-md' : 'border-gray-100 dark:border-gray-800'}`}>
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

const AgentTrainingCard: React.FC<{ 
  status: 'not-started' | 'in-progress' | 'completed';
  voiceSamples?: number;
  totalSamples?: number;
  voiceConfidence?: number;
  talkTime?: string;
  trainingRecords?: TrainingRecord[];
  isActive?: boolean;
  onComplete?: () => void;
}> = ({ 
  status, 
  voiceSamples = 0, 
  totalSamples = 10, 
  voiceConfidence = 0,
  talkTime = '0s',
  trainingRecords = [],
  isActive = false,
  onComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(status !== 'completed' || isActive);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openRolePlayDialog, setOpenRolePlayDialog] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Files selected:', files);
      const fileNames = Array.from(files).map(file => file.name);
      console.log('File names:', fileNames);
      if (onComplete) onComplete();
    }
  };

  const handleRolePlayComplete = () => {
    setOpenRolePlayDialog(false);
    if (onComplete) onComplete();
  };

  return (
    <div className={`rounded-lg overflow-hidden mb-6 border ${
      isActive ? 'border-primary/50 shadow-md ring-2 ring-primary/30 bg-primary/5' : 'border-gray-200 dark:border-gray-800'
    } transition-all duration-300`}>
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center rounded-full w-8 h-8 text-gray-900 dark:text-white ${
              isActive ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Training</h3>
            {status === 'in-progress' && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30 ml-2">
                In Progress
              </Badge>
            )}
            {status === 'completed' && (
              <Badge variant="outline" className="bg-green-500/20 text-green-500 dark:text-green-400 border-green-500/30 ml-2">
                Completed
              </Badge>
            )}
            {status === 'not-started' && (
              <Badge variant="outline" className="bg-gray-500/20 text-gray-500 dark:text-gray-400 border-gray-500/30 ml-2">
                Not Started
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {status === 'in-progress' && <span className="text-sm text-gray-500 dark:text-gray-400">30%</span>}
            {status === 'completed' && <span className="text-sm text-gray-500 dark:text-gray-400">100%</span>}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <ChevronUp className={`h-5 w-5 ${!isExpanded ? 'transform rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Train your voice agent by uploading call recordings or role-play a conversation where you act as the agent
        </p>
        
        {status !== 'not-started' && (
          <Progress 
            value={status === 'completed' ? 100 : 30} 
            className="h-1.5 mb-6"
            indicatorColor={status === 'completed' ? "bg-green-500 dark:bg-green-400" : "bg-amber-500 dark:bg-amber-400"} 
          />
        )}
        
        {isExpanded && (
          <>
            {status === 'not-started' && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8 text-center">
                <Mic className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No voice samples yet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Upload call recordings or start a role-playing session to begin training your agent.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white gap-2"
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Recordings
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    multiple
                    accept="audio/*"
                  />
                  <Button 
                    className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    onClick={() => setOpenRolePlayDialog(true)}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Start Role-Play
                  </Button>
                </div>
              </div>
            )}

            {status === 'in-progress' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Samples</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">3/10</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Recommended samples</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Cloning Confidence</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">65%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Current confidence level</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Average Talk Time</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">45s</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Average duration</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                      <ArrowRight className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Progress: 3 of 10 voice samples uploaded</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upload 7 more voice samples to complete this step.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Training Recordings</h4>
                  <div className="space-y-2">
                    {trainingRecords.map((record) => (
                      <div key={record.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                            {record.type === 'call' ? (
                              <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{record.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{record.date}, {record.time} • {record.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Get Started with Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose one of the following options to begin training your AI agent:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={handleUploadClick}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Call Recordings</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      multiple
                      accept="audio/*"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setOpenRolePlayDialog(true)}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Start Role-Playing</span>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {status === 'completed' && (
              <div className="mb-6">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Completed: Voice training finished</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All required voice samples have been collected and processed.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Samples</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">10/10</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Recommended samples</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Cloning Confidence</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">High confidence level</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Average Talk Time</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">120s</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Average duration</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Training Recordings</h4>
                  <div className="space-y-2">
                    {[...trainingRecords, 
                      {
                        id: '3',
                        title: 'Customer Support Call #2',
                        date: 'Feb 23, 2024',
                        time: '10:30 AM',
                        duration: '4:15',
                        type: 'call'
                      },
                      {
                        id: '4',
                        title: 'Role-Play Session #2',
                        date: 'Feb 24, 2024',
                        time: '2:45 PM',
                        duration: '8:30',
                        type: 'roleplay'
                      }
                    ].map((record) => (
                      <div key={record.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                            {record.type === 'call' ? (
                              <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{record.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{record.date}, {record.time} • {record.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Continue Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add more voice samples to further improve your AI agent:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={handleUploadClick}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload More Recordings</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      multiple
                      accept="audio/*"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setOpenRolePlayDialog(true)}
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>New Role-Play Session</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <RolePlayDialog 
        open={openRolePlayDialog} 
        onOpenChange={setOpenRolePlayDialog}
        onComplete={handleRolePlayComplete}
      />
    </div>
  );
};

interface AgentSetupStepperProps {
  agent: any;
}

export const AgentSetupStepper: React.FC<AgentSetupStepperProps> = ({ agent }) => {
  const { toast } = useToast();
  
  const stepOrder = ['knowledge', 'personas', 'training', 'workflow', 'simulation'];
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  
  const [stepStatuses, setStepStatuses] = useState({
    knowledge: 'not-started' as 'not-started' | 'in-progress' | 'completed',
    personas: 'not-started' as 'not-started' | 'in-progress' | 'completed',
    training: 'not-started' as 'not-started' | 'in-progress' | 'completed',
    workflow: 'not-started' as 'not-started' | 'in-progress' | 'completed',
    simulation: 'not-started' as 'not-started' | 'in-progress' | 'completed'
  });
  
  const sampleTrainingRecords = [
    {
      id: '1',
      title: 'Customer Support Call #1',
      date: 'Feb 20, 2024',
      time: '8:30 AM',
      duration: '5:30',
      type: 'call' as 'call' | 'roleplay'
    },
    {
      id: '2',
      title: 'Role-Play Session #1',
      date: 'Feb 21, 2024',
      time: '3:15 PM',
      duration: '3:45',
      type: 'roleplay' as 'call' | 'roleplay'
    }
  ];

  const sampleDocuments = [
    {
      id: '1',
      title: 'Company Guidelines.pdf',
      type: 'pdf',
      format: 'PDF',
      size: '2.5 MB',
      date: '2024-02-20'
    },
    {
      id: '2',
      title: 'Product Manual.docx',
      type: 'docx',
      format: 'DOCX',
      size: '1.8 MB',
      date: '2024-02-19'
    }
  ];

  const samplePersonas = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      age: '32',
      description: "Sarah is a busy marketing manager at a mid-sized tech company. She needs to stay on top of industry trends while managing her team and multiple campaigns.",
      pain_points: ['Time management', 'Information overload', 'Reporting'],
      goals: ['Increase ROI', 'Streamline workflows', 'Develop team']
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Software Developer',
      age: '28',
      description: "Michael is a full-stack developer who works remotely. He values technical documentation and efficient problem-solving approaches.",
      pain_points: ['Legacy code', 'Unclear requirements', 'Technical debt'],
      goals: ['Write clean code', 'Learn new technologies', 'Build scalable systems']
    }
  ];
  
  const sampleScenarios = [
    { id: "1", name: "Product Information Requests", completed: true },
    { id: "2", name: "Account Management", completed: true },
    { id: "3", name: "Billing Questions", completed: true },
    { id: "4", name: "Service Status Updates", completed: true }
  ];
  
  const sampleSimulations = [
    {
      id: "1",
      name: "Basic Customer Inquiries",
      date: "Feb 25, 2024",
      coverage: 52,
      performance: 68,
      scenarios: 4,
      tokens: "25.3k"
    }
  ];

  const totalSteps = stepOrder.length;
  const completedSteps = Object.values(stepStatuses).filter(status => status === 'completed').length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  const handleStepStarted = (stepName: keyof typeof stepStatuses) => {
    setStepStatuses(prev => ({
      ...prev,
      [stepName]: 'in-progress'
    }));
    
    toast({
      title: "Step Started",
      description: `You've started the ${stepName} step.`,
    });
  };

  const handleStepCompleted = (stepName: keyof typeof stepStatuses) => {
    setStepStatuses(prev => ({
      ...prev,
      [stepName]: 'completed'
    }));
    
    const currentIndex = stepOrder.indexOf(stepName);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < stepOrder.length) {
      const nextStep = stepOrder[nextIndex];
      setActiveStepIndex(nextIndex);
      setStepStatuses(prev => ({
        ...prev,
        [nextStep]: 'in-progress'
      }));
      
      toast({
        title: "Step Completed",
        description: `You've completed the ${stepName} step. Moving to ${nextStep}.`,
      });
    } else {
      toast({
        title: "All Steps Completed",
        description: "You've successfully completed all the setup steps!",
      });
    }
  };
  
  const renderKnowledgeBaseCard = () => {
    if (activeStepIndex === 0 || stepStatuses.knowledge !== 'not-started') {
      return (
        <KnowledgeBaseCard 
          status={stepStatuses.knowledge} 
          documents={stepStatuses.knowledge === 'not-started' ? [] : sampleDocuments}
          processedCount={stepStatuses.knowledge === 'completed' ? 1 : 0}
          totalCount={1}
          isActive={activeStepIndex === 0}
          onComplete={() => handleStepCompleted('knowledge')}
        />
      );
    }
    return null;
  };

  const renderPersonasCard = () => {
    if (activeStepIndex === 1 || stepStatuses.personas !== 'not-started') {
      return (
        <PersonasCard 
          status={stepStatuses.personas}
          personas={stepStatuses.personas === 'not-started' ? [] : samplePersonas}
          generatedCount={stepStatuses.personas === 'completed' ? 2 : 0}
          totalCount={2}
          isActive={activeStepIndex === 1}
          onComplete={() => handleStepCompleted('personas')}
        />
      );
    }
    return null;
  };

  const renderTrainingCard = () => {
    if (activeStepIndex === 2 || stepStatuses.training !== 'not-started') {
      return (
        <AgentTrainingCard 
          status={stepStatuses.training}
          voiceSamples={stepStatuses.training === 'completed' ? 1 : 0}
          totalSamples={1}
          voiceConfidence={stepStatuses.training === 'completed' ? 95 : 0}
          talkTime={stepStatuses.training === 'completed' ? '120s' : '0s'}
          trainingRecords={stepStatuses.training === 'not-started' ? [] : sampleTrainingRecords}
          isActive={activeStepIndex === 2}
          onComplete={() => handleStepCompleted('training')}
        />
      );
    }
    return null;
  };

  const renderWorkflowCard = () => {
    if (activeStepIndex === 3 || stepStatuses.workflow !== 'not-started') {
      return (
        <WorkflowCard 
          status={stepStatuses.workflow}
          stepNumber={4}
          isActive={activeStepIndex === 3}
          onComplete={() => handleStepCompleted('workflow')}
        />
      );
    }
    return null;
  };

  const renderSimulationCard = () => {
    if (activeStepIndex === 4 || stepStatuses.simulation !== 'not-started') {
      return (
        <SimulationCard 
          status={stepStatuses.simulation}
          coverage={stepStatuses.simulation === 'not-started' ? undefined : 52}
          performance={stepStatuses.simulation === 'not-started' ? undefined : 68}
          scenarios={stepStatuses.simulation === 'not-started' ? undefined : sampleScenarios}
          simulations={stepStatuses.simulation === 'not-started' ? undefined : sampleSimulations}
          isActive={activeStepIndex === 4}
          onComplete={() => handleStepCompleted('simulation')}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Setup</h2>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2 text-gray-700 dark:text-gray-300">{overallProgress}% Complete</span>
            <Progress 
              value={overallProgress} 
              className="w-24 h-2"
              indicatorColor={
                overallProgress === 100 
                  ? "bg-green-500 dark:bg-green-400" 
                  : overallProgress > 0 
                    ? "bg-amber-500 dark:bg-amber-400" 
                    : "bg-gray-400 dark:bg-gray-600"
              }
            />
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          Complete these steps in order to fully configure your agent for optimal performance
        </p>
      </div>
      
      <div className="space-y-4 mt-8">
        {renderKnowledgeBaseCard()}
        {renderPersonasCard()}
        {renderTrainingCard()}
        {renderWorkflowCard()}
        {renderSimulationCard()}
      </div>
    </div>
  );
};

