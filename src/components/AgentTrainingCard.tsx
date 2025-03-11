import React, { useState, useRef } from "react";
import { 
  Mic, Upload, CircleDashed, ArrowRight, Clock, BarChart, 
  ChevronUp, CheckCircle2, PlayCircle, User, Download, Trash2,
  FileAudio, PhoneCall, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RolePlayDialog } from "./RolePlayDialog";
import { UserPersonasModal } from "./UserPersonasModal";
import { CallInterface } from "./CallInterface";

interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
}

interface AgentTrainingCardProps {
  status: 'not-started' | 'in-progress' | 'completed';
  stepNumber: number;
  isActive?: boolean;
  voiceSamples?: number;
  totalSamples?: number;
  voiceConfidence?: number;
  talkTime?: string;
  trainingRecords?: TrainingRecord[];
  onStart?: () => void;
  onComplete?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const AgentTrainingCard: React.FC<AgentTrainingCardProps> = ({
  status,
  stepNumber,
  isActive = false,
  voiceSamples = 0,
  totalSamples = 10,
  voiceConfidence = 0,
  talkTime = '0s',
  trainingRecords = [],
  onStart,
  onComplete,
  isExpanded: controlledExpanded,
  onToggleExpand
}) => {
  const [localExpanded, setLocalExpanded] = useState(status !== 'completed');
  const isExpanded = onToggleExpand ? controlledExpanded : localExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openRolePlayDialog, setOpenRolePlayDialog] = useState(false);
  const [callRolePlayDialog, setCallRolePlayDialog] = useState(false);
  
  const [userPersonasModalOpen, setUserPersonasModalOpen] = useState(false);
  const [callInterfaceOpen, setCallInterfaceOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);

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
    }
  };
  
  const handleSelectPersona = (persona: any) => {
    setSelectedPersona(persona);
    setUserPersonasModalOpen(false);
    setCallInterfaceOpen(true);
  };

  return (
    <div className={`rounded-lg overflow-hidden mb-6 border transition-colors ${
      isActive 
        ? 'border-primary shadow-md border-2' 
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 text-gray-900 dark:text-white">
              {stepNumber}
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
              onClick={handleToggleExpand}
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
          />
        )}
        
        {isExpanded && (
          <>
            {status === 'not-started' && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
                <Mic className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No voice samples yet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Upload call recordings or start a role-playing session to begin training your agent.
                </p>
                
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {/* Option 1: Upload Recordings */}
                  <div 
                    onClick={handleUploadClick} 
                    className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      multiple
                      accept="audio/*"
                    />
                    <FileAudio className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Recordings</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag files here</span>
                  </div>
                  
                  {/* Option 2: Call to Role Play */}
                  <div 
                    onClick={() => setCallRolePlayDialog(true)} 
                    className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Call to Role Play</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice with humans</span>
                  </div>
                  
                  {/* Option 3: Role Play with AI - Now with primary button styling */}
                  <div 
                    onClick={() => setUserPersonasModalOpen(true)} 
                    className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Bot className="h-12 w-12 text-primary dark:text-primary mb-3" />
                    <span className="text-sm font-medium text-primary dark:text-primary">Role Play with AI</span>
                    <span className="text-xs text-primary/70 dark:text-primary/70 mt-1">Practice with AI</span>
                  </div>
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
                  
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {/* Option 1: Upload Recordings */}
                    <div 
                      onClick={handleUploadClick} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                        accept="audio/*"
                      />
                      <FileAudio className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Recordings</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag files here</span>
                    </div>
                    
                    {/* Option 2: Call to Role Play */}
                    <div 
                      onClick={() => setCallRolePlayDialog(true)} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Call to Role Play</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice with humans</span>
                    </div>
                    
                    {/* Option 3: Role Play with AI */}
                    <div 
                      onClick={() => setUserPersonasModalOpen(true)} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <Bot className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Play with AI</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice with AI</span>
                    </div>
                  </div>
                </div>
                {onComplete && (
                  <Button onClick={onComplete}>Complete Training</Button>
                )}
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
                        type: 'call' as const
                      },
                      {
                        id: '4',
                        title: 'Role-Play Session #2',
                        date: 'Feb 24, 2024',
                        time: '2:45 PM',
                        duration: '8:30',
                        type: 'roleplay' as const
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
                  
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {/* Option 1: Upload Recordings */}
                    <div 
                      onClick={handleUploadClick} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                        accept="audio/*"
                      />
                      <FileAudio className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Recordings</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag files here</span>
                    </div>
                    
                    {/* Option 2: Call to Role Play */}
                    <div 
                      onClick={() => setCallRolePlayDialog(true)} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Call to Role Play</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice with humans</span>
                    </div>
                    
                    {/* Option 3: Role Play with AI */}
                    <div 
                      onClick={() => setUserPersonasModalOpen(true)} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <Bot className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Play with AI</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice with AI</span>
                    </div>
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
      />
      
      <RolePlayDialog 
        open={callRolePlayDialog} 
        onOpenChange={setCallRolePlayDialog} 
      />
      
      <UserPersonasModal
        open={userPersonasModalOpen}
        onOpenChange={setUserPersonasModalOpen}
        onSelectPersona={handleSelectPersona}
      />
      
      <CallInterface
        open={callInterfaceOpen}
        onOpenChange={setCallInterfaceOpen}
        persona={selectedPersona}
      />
    </div>
  );
};
