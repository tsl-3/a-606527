
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Users, UserRound, MessageCircle, Brain, ArrowRight, Send, Phone, Mic, PhoneCall, Pause, Play, PhoneOff, Volume2, Timer, FileText, Volume, MicOff, StopCircle, Save, Trash, X, Check, Redo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch, SwitchWithLabels } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const samplePersonas = [
  { id: 1, name: "Emily", role: "Product Manager", avatar: "E", description: "Focused on feature prioritization and roadmap planning", background: "8 years in product management, previously worked at Google", communication: "Direct and data-driven", painPoints: "Tight deadlines, resource constraints" },
  { id: 2, name: "Michael", role: "IT Support", avatar: "M", description: "Technical support specialist with hardware expertise", background: "5 years in IT support, CompTIA certified", communication: "Patient and methodical", painPoints: "Complex legacy systems, urgent requests" },
  { id: 3, name: "Sarah", role: "Customer Success", avatar: "S", description: "Helps customers achieve their goals with the product", background: "4 years in customer-facing roles", communication: "Empathetic and solution-oriented", painPoints: "Feature gaps, customer churn risk" },
  { id: 4, name: "David", role: "Finance Manager", avatar: "D", description: "Handles budgeting and financial planning inquiries", background: "10+ years in finance, CPA certified", communication: "Analytical and detail-oriented", painPoints: "Budget constraints, audit compliance" },
  { id: 5, name: "Jessica", role: "HR Representative", avatar: "J", description: "Specializes in employee benefits and policies", background: "6 years in HR management", communication: "Supportive and diplomatic", painPoints: "Policy enforcement, employee satisfaction" },
  { id: 6, name: "Robert", role: "Sales Representative", avatar: "R", description: "Focuses on addressing prospect questions and concerns", background: "12 years in B2B sales", communication: "Persuasive and relationship-focused", painPoints: "Meeting quotas, competitive landscape" },
  { id: 7, name: "Amanda", role: "Marketing Specialist", avatar: "A", description: "Expert in digital marketing strategies", background: "7 years in digital marketing", communication: "Creative and data-informed", painPoints: "ROI measurement, campaign deadlines" },
  { id: 8, name: "James", role: "Operations Manager", avatar: "J", description: "Focuses on operational efficiency and processes", background: "9 years in operations management", communication: "Process-oriented and pragmatic", painPoints: "Supply chain issues, quality control" },
  { id: 9, name: "Lisa", role: "Legal Advisor", avatar: "L", description: "Provides guidance on legal and compliance matters", background: "Attorney with 8 years of corporate law experience", communication: "Precise and risk-aware", painPoints: "Regulatory changes, compliance deadlines" },
  { id: 10, name: "Thomas", role: "Product Support", avatar: "T", description: "Technical product expert for troubleshooting", background: "3 years with the product, engineering background", communication: "Technical but approachable", painPoints: "Complex edge cases, version compatibility" },
];

interface Message {
  id: string;
  sender: 'user' | 'persona';
  text: string;
  timestamp: Date;
}

interface Recording {
  id: string;
  name: string;
  persona: string;
  date: Date;
  duration: number;
  transcript: string[];
  isTraining: boolean;
}

export const RolePlayDialog = ({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) => {
  const [stage, setStage] = useState<'selection' | 'persona-setup' | 'persona-list' | 'persona-detail' | 'chat' | 'call' | 'recording-review' | 'recordings-list'>('selection');
  const [personaDescription, setPersonaDescription] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<typeof samplePersonas[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [knowledgeResults, setKnowledgeResults] = useState<string[]>([]);
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: "1",
      name: "Call with Sarah",
      persona: "Sarah",
      date: new Date(Date.now() - 86400000), // Yesterday
      duration: 125, // 2:05 minutes
      transcript: [
        "Call connected with Sarah",
        "You: Thanks for explaining that. I have a question about your experience with our product.",
        "Sarah: I've been using your product for about 6 months now. It's mostly been positive, but I've had some challenges with the reporting features."
      ],
      isTraining: true
    },
    {
      id: "2",
      name: "IT Support Discussion",
      persona: "Michael",
      date: new Date(Date.now() - 172800000), // 2 days ago
      duration: 210, // 3:30 minutes
      transcript: [
        "Call connected with Michael",
        "You: Hi Michael, I'm having issues with my login access.",
        "Michael: I understand. Let me walk you through some troubleshooting steps."
      ],
      isTraining: true
    }
  ]);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([]);
  const [availableSpeakers, setAvailableSpeakers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(error => {
            console.error('Permission denied for audio:', error);
            toast.error('Please allow microphone access to use audio features');
            return;
          });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind === 'audioinput' && device.deviceId);
        const speakers = devices.filter(device => device.kind === 'audiooutput' && device.deviceId);
        
        setAvailableMics(mics);
        setAvailableSpeakers(speakers);
        
        if (mics.length > 0) setSelectedMic(mics[0].deviceId);
        if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);

      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Unable to access audio devices. Please check your browser permissions.');
      }
    };

    if (stage === 'call' && !isCallActive) {
      getDevices();

      navigator.mediaDevices.addEventListener('devicechange', getDevices);
      
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      };
    }
  }, [stage, isCallActive]);

  useEffect(() => {
    if (isCallActive && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (!isCallActive && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCallActive]);

  useEffect(() => {
    if (isPlaying && !playbackTimerRef.current && currentRecording) {
      const totalDuration = currentRecording.duration;
      const startTime = Date.now();
      const startProgress = playbackProgress;
      
      playbackTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(startProgress + (elapsed / (totalDuration * 10)), 100);
        setPlaybackProgress(newProgress);
        
        if (newProgress >= 100) {
          setIsPlaying(false);
          clearInterval(playbackTimerRef.current!);
          playbackTimerRef.current = null;
        }
      }, 100);
    } else if (!isPlaying && playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };
  }, [isPlaying, currentRecording, playbackProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: 'someone' | 'personas' | 'recordings') => {
    if (option === 'someone') {
      setStage('call');
    } else if (option === 'recordings') {
      setStage('recordings-list');
    } else {
      setStage('persona-setup');
    }
  };

  const handleGeneratePersonas = () => {
    setStage('persona-list');
  };

  const handlePersonaSelect = (persona: typeof samplePersonas[0]) => {
    setSelectedPersona(persona);
    setStage('persona-detail');
  };

  const handleStartRolePlay = () => {
    if (selectedPersona) {
      setStage('call');
      setTimeout(() => {
        setIsCallActive(true);
        setCallDuration(0);
        setIsRecording(true);
        setTranscription([`Call connected with ${selectedPersona.name}`]);
        
        handleStartRecording();
      }, 500);
    }
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
  };

  const handleStartCall = () => {
    if (selectedPersona) {
      setIsCallActive(true);
      setCallDuration(0);
      setIsRecording(true);
      
      setTimeout(() => {
        setTranscription([`Call connected with ${selectedPersona.name}`]);
        
        handleStartRecording();
      }, 2000);
      return;
    }

    if (!phoneNumber) {
      setPhoneNumberError('Please enter a phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError('Please enter a valid phone number');
      return;
    }

    setPhoneNumberError('');
    setIsCallActive(true);
    setCallDuration(0);
    setIsRecording(true);
    
    setTimeout(() => {
      setTranscription([`Call connected with ${phoneNumber}`]);
      toast.success("Call connected successfully");
      
      handleStartRecording();
    }, 2000);
  };

  const handleToggleMic = () => {
    setIsMicMuted(!isMicMuted);
    toast.success(isMicMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const handleToggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    toast.success(isAudioMuted ? "Audio unmuted" : "Audio muted");
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsRecording(false);
    
    // Create a new recording object
    if (transcription.length > 0) {
      const newRecording: Recording = {
        id: Date.now().toString(),
        name: `Call with ${selectedPersona ? selectedPersona.name : phoneNumber}`,
        persona: selectedPersona ? selectedPersona.name : phoneNumber,
        date: new Date(),
        duration: callDuration,
        transcript: [...transcription],
        isTraining: true
      };
      
      setCurrentRecording(newRecording);
      setPlaybackProgress(0);
      setStage('recording-review');
    }
  };

  const handleToggleMute = () => {
    setIsCallMuted(!isCallMuted);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsLoadingTranscription(true);
    
    setTimeout(() => {
      setIsLoadingTranscription(false);
      
      const userTranscript = "Thanks for explaining that. I have a question about your experience with our product.";
      setTranscription(prev => [...prev, `You: ${userTranscript}`]);
      
      setTimeout(() => {
        if (selectedPersona) {
          setTranscription(prev => [...prev, `${selectedPersona.name}: I've been using your product for about 6 months now. It's mostly been positive, but I've had some challenges with the reporting features.`]);
        }
      }, 3000);
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Recording stopped");
  };

  const handlePlayRecording = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleResetPlayback = () => {
    setPlaybackProgress(0);
    setIsPlaying(false);
  };

  const handleSaveAndTrain = () => {
    if (currentRecording) {
      setRecordings(prev => [currentRecording, ...prev]);
      toast.success("Recording saved and added to training");
      setStage('selection');
      setCurrentRecording(null);
    }
  };

  const handleRedoRecording = () => {
    setCurrentRecording(null);
    setStage('call');
    setCallDuration(0);
    setTranscription([]);
    setTimeout(() => {
      handleStartCall();
    }, 500);
  };

  const handleToggleTraining = (id: string) => {
    setRecordings(prev => prev.map(recording => 
      recording.id === id 
        ? { ...recording, isTraining: !recording.isTraining }
        : recording
    ));
    toast.success("Training status updated");
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
    toast.success("Recording deleted");
  };

  const handlePlayRecordingFromList = (recording: Recording) => {
    setCurrentRecording(recording);
    setPlaybackProgress(0);
    setStage('recording-review');
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newUserMessage]);
    setCurrentMessage('');

    setTimeout(() => {
      const newPersonaMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'persona',
        text: `I understand your question about "${currentMessage}". Let me help you with that...`,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newPersonaMessage]);
    }, 1000);
  };

  const handleKnowledgeSearch = () => {
    if (searchQuery.trim() === '') return;

    setKnowledgeResults([
      `Article about "${searchQuery}" from the knowledge base.`,
      `FAQ entry related to "${searchQuery}".`,
      `Best practices for handling "${searchQuery}" situations.`,
    ]);
  };

  const handleClose = () => {
    setStage('selection');
    setPersonaDescription('');
    setSelectedPersona(null);
    setMessages([]);
    setCurrentMessage('');
    setSearchQuery('');
    setKnowledgeResults([]);
    setIsCallActive(false);
    setCallDuration(0);
    setTranscription([]);
    setCurrentRecording(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[85vw] max-h-[90vh] flex flex-col">
        {stage === 'selection' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Role-Play Session</DialogTitle>
              <DialogDescription>
                Choose a role-play option to start training your agent
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              <div 
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center text-center transition-all"
                onClick={() => handleOptionSelect('someone')}
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <PhoneCall className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Role-Play Call</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start a voice call session with a real person to practice customer conversations
                </p>
              </div>
              
              <div 
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center text-center transition-all"
                onClick={() => handleOptionSelect('personas')}
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <UserRound className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">User Personas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define customer types and generate personas for targeted training calls
                </p>
              </div>

              <div 
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center text-center transition-all"
                onClick={() => handleOptionSelect('recordings')}
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Recordings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and manage your saved role-play recordings
                </p>
              </div>
            </div>
          </>
        )}

        {stage === 'persona-setup' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Define Your User Personas</DialogTitle>
              <DialogDescription>
                Describe how your typical customers or users behave to generate relevant personas
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Textarea 
                placeholder="Describe your typical customers or users. For example: 'Our users are primarily small business owners who need help with accounting software. They often have questions about invoicing, taxes, and financial reports.'"
                className="min-h-[150px]"
                value={personaDescription}
                onChange={(e) => setPersonaDescription(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setStage('selection')}
              >
                Back
              </Button>
              <Button
                onClick={handleGeneratePersonas}
                disabled={personaDescription.trim().length < 10}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                Generate Personas
              </Button>
            </DialogFooter>
          </>
        )}

        {stage === 'persona-list' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Select a Persona</DialogTitle>
              <DialogDescription>
                Choose one of the generated personas to start a role-play session
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 overflow-y-auto grid grid-cols-1 gap-3 max-h-[400px]">
              {samplePersonas.map((persona) => (
                <div 
                  key={persona.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex items-center gap-4 transition-all"
                  onClick={() => handlePersonaSelect(persona)}
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                    {persona.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{persona.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{persona.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{persona.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setStage('persona-setup')}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}
        
        {stage === 'persona-detail' && selectedPersona && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Persona Details</DialogTitle>
              <DialogDescription>
                Review this persona's information before starting the role-play
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedPersona.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-medium">{selectedPersona.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPersona.role}</p>
                  <p className="mt-2">{selectedPersona.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-secondary/30 dark:bg-secondary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    Background
                  </h4>
                  <p className="text-sm">{selectedPersona.background}</p>
                </div>
                
                <div className="bg-secondary/30 dark:bg-secondary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Communication Style
                  </h4>
                  <p className="text-sm">{selectedPersona.communication}</p>
                </div>
                
                <div className="bg-secondary/30 dark:bg-secondary/10 p-4 rounded-lg col-span-1 md:col-span-2">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Pain Points
                  </h4>
                  <p className="text-sm">{selectedPersona.painPoints}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setStage('persona-list')}
              >
                Back
              </Button>
              <Button
                onClick={handleStartRolePlay}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                Start Role-Play Call
              </Button>
            </DialogFooter>
          </>
        )}

        {stage === 'call' && !isCallActive && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Role-Play Call</DialogTitle>
                  <DialogDescription>External Call</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full gap-8">
              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setPhoneNumberError('');
                    }}
                    className={phoneNumberError ? 'border-red-500' : ''}
                  />
                  {phoneNumberError && (
                    <p className="text-sm text-red-500">{phoneNumberError}</p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <Button 
                  onClick={handleStartCall} 
                  className="bg-primary hover:bg-primary/90 text-white w-full"
                  size="lg"
                >
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Start Call
                </Button>
              </div>
            </div>
          </>
        )}

        {stage === 'call' && isCallActive && (
          <>
            <DialogHeader className="border-b pb-3">
              <div className="flex items-center gap-3">
                {selectedPersona ? (
                  <>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                      {selectedPersona.avatar}
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{selectedPersona.name}</DialogTitle>
                      <DialogDescription className="text-sm">
                        {selectedPersona.role}
                      </DialogDescription>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{phoneNumber || "Role-Play Call"}</DialogTitle>
                      <DialogDescription className="text-sm">
                        External Call
                      </DialogDescription>
                    </div>
                  </>
                )}
                {isCallActive && (
                  <Badge variant="outline" className="ml-auto border-green-500/30 text-green-500 bg-green-500/10">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Call in progress
                    </span>
                  </Badge>
                )}
              </div>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden py-4">
              <div className="flex-1 flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-4 bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{formatTime(callDuration)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${isCallMuted ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : ''}`}
                      onClick={handleToggleMute}
                    >
                      {isCallMuted ? <Volume2 className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      <span className="ml-1.5">{isCallMuted ? 'Unmute' : 'Mute'}</span>
                    </Button>
                    
                    {isRecording ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/10 text-red-500 border-red-500/30"
                        onClick={handleStopRecording}
                      >
                        <StopCircle className="h-4 w-4" />
                        <span className="ml-1.5">Stop Recording</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStartRecording}
                      >
                        <Mic className="h-4 w-4" />
                        <span className="ml-1.5">Start Recording</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleEndCall}
                    >
                      <PhoneOff className="h-4 w-4" />
                      <span className="ml-1.5">End</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-4 bg-secondary/20 rounded-lg p-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/30">
                        Call started with {selectedPersona ? selectedPersona.name : phoneNumber}
                      </Badge>
                    </div>
                    
                    {isLoadingTranscription && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex flex-col items-center">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground mt-2">Transcribing...</span>
                        </div>
                      </div>
                    )}
                    
                    {transcription.map((line, index) => {
                      const [speaker, ...textParts] = line.split(': ');
                      const text = textParts.join(': ');
                      const isUser = speaker === 'You';
                      
                      return (
                        <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex items-start gap-3 max-w-[80%]">
                            {!isUser && selectedPersona && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {selectedPersona.avatar}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`rounded-lg p-3 ${
                              isUser 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}>
                              <p className="text-sm">{text}</p>
                            </div>
                            
                            {isUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-secondary text-primary text-sm">
                                  You
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Live Transcription</span>
                </div>
              </div>
              
              <div className="w-full md:w-[250px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 flex flex-col">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Knowledge Base
                </h4>
                
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search knowledge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleKnowledgeSearch();
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleKnowledgeSearch}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2">
                  {knowledgeResults.length > 0 ? (
                    knowledgeResults.map((result, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-xs"
                      >
                        {result}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-xs pt-4">
                      Search the knowledge base to find relevant information
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {stage === 'recording-review' && currentRecording && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Recording Review</DialogTitle>
              <DialogDescription>
                Review your recording before saving it for training
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 flex flex-col">
              <div className="bg-secondary/30 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium">{currentRecording.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentRecording.date.toLocaleDateString()} • {formatTime(currentRecording.duration)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handlePlayRecording}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <Progress value={playbackProgress} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{formatTime(Math.floor(currentRecording.duration * (playbackProgress / 100)))}</span>
                  <span>{formatTime(currentRecording.duration)}</span>
                </div>
              </div>
              
              <div className="border rounded-lg flex-1 overflow-y-auto max-h-[300px] mb-4">
                <div className="p-4 space-y-4">
                  {currentRecording.transcript.map((line, index) => {
                    const [speaker, ...textParts] = line.split(': ');
                    const text = textParts.join(': ');
                    const isUser = speaker === 'You';
                    
                    if (!text) return null; // Skip lines without proper format
                    
                    return (
                      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-start gap-3 max-w-[80%]">
                          {!isUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {currentRecording.persona.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`rounded-lg p-3 ${
                            isUser 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}>
                            <p className="text-sm">{text}</p>
                          </div>
                          
                          {isUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary text-primary text-sm">
                                You
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex gap-3 w-full justify-between md:justify-end">
                  <Button
                    variant="outline"
                    onClick={handleRedoRecording}
                  >
                    <Redo className="h-4 w-4 mr-2" />
                    Re-do Recording
                  </Button>
                  
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSaveAndTrain}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save & Use for Training
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </>
        )}

        {stage === 'recordings-list' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Saved Recordings</DialogTitle>
              <DialogDescription>
                Manage your role-play recordings and training data
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 overflow-y-auto max-h-[500px]">
              <div className="space-y-4">
                {recordings.length > 0 ? (
                  recordings.map((recording) => (
                    <Card key={recording.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">{recording.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {recording.date.toLocaleDateString()} • {formatTime(recording.duration)}
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleToggleTraining(recording.id)}
                              className={recording.isTraining ? 'text-green-600' : 'text-gray-400'}
                            >
                              {recording.isTraining ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              <span className="sr-only">{recording.isTraining ? 'Remove from training' : 'Add to training'}</span>
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteRecording(recording.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-xs truncate text-muted-foreground">
                          {recording.transcript.length > 1 ? recording.transcript[1] : "No transcript available"}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-3 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePlayRecordingFromList(recording)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play Recording
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 dark:bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium mb-1">No recordings yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete a role-play call to create your first recording
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStage('selection')}
              >
                Back to Options
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
