import React, { useState, useRef } from "react";
import { 
  Mic, Upload, CircleDashed, ArrowRight, Clock, BarChart, 
  ChevronUp, CheckCircle2, PlayCircle, User, Download, Trash2,
  FileAudio, PhoneCall, Bot, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RolePlayDialog } from "./RolePlayDialog";
import { UserPersonasSidebar } from "./UserPersonasSidebar";
import { CallInterface, RecordingData } from "./CallInterface";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
  transcriptions?: string[];
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
  const [localStatus, setLocalStatus] = useState<'not-started' | 'in-progress' | 'completed'>(status);
  const [localTrainingRecords, setLocalTrainingRecords] = useState<TrainingRecord[]>(trainingRecords);
  const [localVoiceSamples, setLocalVoiceSamples] = useState(voiceSamples);
  const [localVoiceConfidence, setLocalVoiceConfidence] = useState(voiceConfidence);
  const [totalRecordingMinutes, setTotalRecordingMinutes] = useState(0);
  const targetMinutes = 10; // Set target to 10 minutes

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
  
  const [userPersonasSidebarOpen, setUserPersonasSidebarOpen] = useState(false);
  const [callInterfaceOpen, setCallInterfaceOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);

  const durationToMinutes = (duration: string): number => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes + seconds / 60;
  };

  const calculateTotalMinutes = (records: TrainingRecord[]): number => {
    return records.reduce((total, record) => {
      return total + durationToMinutes(record.duration);
    }, 0);
  };

  const formatMinutes = (minutes: number): string => {
    return minutes.toFixed(1);
  };

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
      
      if (localStatus === 'not-started') {
        setLocalStatus('in-progress');
        if (onStart) onStart();
      }
      
      const now = new Date();
      const newRecordings = Array.from(files).map((file, index) => {
        const minutes = Math.floor(Math.random() * 2) + 1;
        const seconds = Math.floor(Math.random() * 60);
        const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        return {
          id: Math.random().toString(36).substring(2, 9),
          title: `Uploaded Recording ${localTrainingRecords.length + index + 1}`,
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          duration,
          type: 'call' as const
        };
      });
      
      const updatedRecords = [...localTrainingRecords, ...newRecordings];
      setLocalTrainingRecords(updatedRecords);
      
      const newTotalMinutes = calculateTotalMinutes(updatedRecords);
      setTotalRecordingMinutes(newTotalMinutes);
      setLocalVoiceSamples(prev => prev + files.length);
      setLocalVoiceConfidence(prev => Math.min(prev + 10, 95));
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} recording${files.length > 1 ? 's' : ''} added to training data.`
      });
      
      if (newTotalMinutes >= targetMinutes && localStatus !== 'completed') {
        setLocalStatus('completed');
        if (onComplete) onComplete();
      }
    }
  };
  
  const handleSelectPersona = (persona: any) => {
    setSelectedPersona(persona);
    setUserPersonasSidebarOpen(false);
    setCallInterfaceOpen(true);
  };
  
  const handleCallComplete = (recordingData: RecordingData) => {
    if (localStatus === 'not-started') {
      setLocalStatus('in-progress');
      if (onStart) onStart();
    }
    
    const updatedRecords = [...localTrainingRecords, recordingData];
    setLocalTrainingRecords(updatedRecords);
    
    const newTotalMinutes = calculateTotalMinutes(updatedRecords);
    setTotalRecordingMinutes(newTotalMinutes);
    setLocalVoiceSamples(prev => prev + 1);
    setLocalVoiceConfidence(prev => Math.min(prev + 15, 95));
    
    toast({
      title: "Call recording saved",
      description: "The role-play session has been added to your training data."
    });
    
    if (newTotalMinutes >= targetMinutes && localStatus !== 'completed') {
      setLocalStatus('completed');
      if (onComplete) onComplete();
    }
  };
  
  const handleRemoveRecording = (id: string) => {
    const updatedRecords = localTrainingRecords.filter(record => record.id !== id);
    setLocalTrainingRecords(updatedRecords);
    
    const newTotalMinutes = calculateTotalMinutes(updatedRecords);
    setTotalRecordingMinutes(newTotalMinutes);
    setLocalVoiceSamples(prev => Math.max(prev - 1, 0));
    
    if (newTotalMinutes < targetMinutes && localStatus === 'completed') {
      setLocalStatus('in-progress');
    }
    
    toast({
      title: "Recording removed",
      description: "The recording has been removed from your training data."
    });
  };
  
  const handlePlayRecording = (record: TrainingRecord) => {
    toast({
      title: "Playing recording",
      description: `Now playing: ${record.title}`
    });
    
    console.log("Playing recording:", record);
  };

  React.useEffect(() => {
    const minutes = calculateTotalMinutes(localTrainingRecords);
    setTotalRecordingMinutes(minutes);
  }, []);

  const progressPercentage = Math.min(Math.round((totalRecordingMinutes / targetMinutes) * 100), 100);

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
            {localStatus === 'in-progress' && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30 ml-2">
                In Progress
              </Badge>
            )}
            {localStatus === 'completed' && (
              <Badge variant="outline" className="bg-green-500/20 text-green-500 dark:text-green-400 border-green-500/30 ml-2">
                Completed
              </Badge>
            )}
            {localStatus === 'not-started' && (
              <Badge variant="outline" className="bg-gray-500/20 text-gray-500 dark:text-gray-400 border-gray-500/30 ml-2">
                Not Started
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {localStatus === 'in-progress' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {progressPercentage}%
              </span>
            )}
            {localStatus === 'completed' && <span className="text-sm text-gray-500 dark:text-gray-400">100%</span>}
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
        
        {localStatus !== 'not-started' && (
          <Progress 
            value={progressPercentage} 
            className="h-1.5 mb-6" 
          />
        )}
        
        {isExpanded && (
          <>
            {localStatus === 'not-started' && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
                <Mic className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No voice samples yet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Upload call recordings or start a role-playing session to begin training your agent.
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
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
                  
                  <div 
                    onClick={() => setUserPersonasSidebarOpen(true)} 
                    className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Bot className="h-12 w-12 text-primary dark:text-primary mb-3" />
                    <span className="text-sm font-medium text-primary dark:text-primary">Call to Role Play</span>
                    <span className="text-xs text-primary/70 dark:text-primary/70 mt-1">Call to generate training recordings</span>
                  </div>
                </div>
              </div>
            )}

            {localStatus === 'in-progress' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Recording Duration</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatMinutes(totalRecordingMinutes)}/{targetMinutes}m</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Target minutes</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Cloning Confidence</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{localVoiceConfidence}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Current confidence level</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Mic className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Samples</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{localVoiceSamples}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Total recordings</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                      <ArrowRight className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">
                        Progress: {formatMinutes(totalRecordingMinutes)} of {targetMinutes} minutes recorded
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload or record {formatMinutes(Math.max(targetMinutes - totalRecordingMinutes, 0))} more minutes to complete this step.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Training Recordings ({formatMinutes(totalRecordingMinutes)} minutes total)</h4>
                  <div className="space-y-3">
                    {localTrainingRecords.map((record) => (
                      <div key={record.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-2 text-gray-700 dark:text-gray-300"
                                    onClick={() => handlePlayRecording(record)}
                                  >
                                    <PlayCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Play</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Play recording</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="gap-2 text-gray-700 dark:text-gray-300"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                    <span className="hidden sm:inline">Use for Training</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Use this recording to enhance agent training</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30"
                                    onClick={() => handleRemoveRecording(record.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Remove</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove recording</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {localTrainingRecords.length === 0 && (
                      <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No recordings yet. Add recordings using one of the methods below.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Get Started with Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose one of the following options to begin training your AI agent:</p>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
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
                    
                    <div 
                      onClick={() => setUserPersonasSidebarOpen(true)} 
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <Bot className="h-12 w-12 text-primary dark:text-primary mb-3" />
                      <span className="text-sm font-medium text-primary dark:text-primary">Call to Role Play</span>
                      <span className="text-xs text-primary/70 dark:text-primary/70 mt-1">Call to generate training recordings</span>
                    </div>
                  </div>
                </div>
                
                {totalRecordingMinutes >= targetMinutes && onComplete && (
                  <Button onClick={onComplete} className="mb-4">Complete Training</Button>
                )}
              </>
            )}

            {localStatus === 'completed' && (
              <>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Completed: Voice training finished</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">The required {targetMinutes} minutes of voice recordings have been collected and processed.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Recording Duration</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatMinutes(Math.max(totalRecordingMinutes, targetMinutes))}/{targetMinutes}m</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Goal achieved</div>
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
                      <Mic className="h-4 w-4" />
                      <span className="text-xs font-medium">Voice Samples</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{localTrainingRecords.length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Total recordings</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Training Recordings ({formatMinutes(totalRecordingMinutes)} minutes total)</h4>
                  <div className="space-y-3">
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
                      <div key={record.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
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
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-2 text-gray-700 dark:text-gray-300"
                                    onClick={() => handlePlayRecording(record)}
                                  >
                                    <PlayCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Play</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Play recording</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="gap-2 text-gray-700 dark:text-gray-300"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                    <span className="hidden sm:inline">Use for Training</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Use this recording to enhance agent training</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30"
                                    onClick={() => handleRemoveRecording(record.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Remove</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove recording</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Continue Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add more voice samples to further improve your AI agent's voice quality and recognition capabilities.</p>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
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
                    
                    <div 
                      onClick={() => setUserPersonasSidebarOpen(true)}
                      className="aspect-square flex flex-col items-center justify-center p-6 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <Bot className="h-12 w-12 text-primary dark:text-primary mb-3" />
                      <span className="text-sm font-medium text-primary dark:text-primary">Call to Role Play</span>
                      <span className="text-xs text-primary/70 dark:text-primary/70 mt-1">Call to generate training recordings</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {userPersonasSidebarOpen && (
        <UserPersonasSidebar 
          open={userPersonasSidebarOpen} 
          onOpenChange={() => setUserPersonasSidebarOpen(false)}
          onSelectPersona={handleSelectPersona}
        />
      )}
      
      {callInterfaceOpen && selectedPersona && (
        <CallInterface 
          open={callInterfaceOpen}
          onOpenChange={() => setCallInterfaceOpen(false)}
          persona={selectedPersona}
          onCallComplete={handleCallComplete}
        />
      )}
    </div>
  );
};
