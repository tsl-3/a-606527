
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, MicOff, Save, Trash, Volume2, RefreshCw, Phone, User, Rocket, ArrowRight, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AgentType } from '@/types/agent';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RolePlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentType;
  selectedMicrophone: string | null;
  selectedSpeaker: string | null;
  setMicrophone: (deviceId: string) => void;
  setSpeaker: (deviceId: string) => void;
  rolePlayMode: 'person' | 'ai';
  setRolePlayType: (mode: 'person' | 'ai') => void;
}

interface MediaDevice {
  deviceId: string;
  label: string;
}

enum CallState {
  MODE_SELECT = 'mode_select',
  PERSONA_SELECT = 'persona_select',
  PERSON_SETUP = 'person_setup',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REVIEW = 'review',
}

export const CustomRolePlayDialog = ({
  open,
  onOpenChange,
  agent,
  selectedMicrophone,
  selectedSpeaker,
  setMicrophone,
  setSpeaker,
  rolePlayMode,
  setRolePlayType
}: RolePlayDialogProps) => {
  const { toast } = useToast();
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDevice[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [callState, setCallState] = useState<CallState>(CallState.MODE_SELECT);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<{id: string, title: string, url: string, isTraining: boolean}[]>([]);
  const [personas, setPersonas] = useState([
    { id: '1', name: 'Customer', description: 'A standard customer calling for help' },
    { id: '2', name: 'Angry Customer', description: 'A frustrated customer with a problem' },
    { id: '3', name: 'New User', description: 'Someone unfamiliar with your product' },
    { id: '4', name: 'Technical User', description: 'Someone with technical knowledge' },
  ]);
  const [selectedPersona, setSelectedPersona] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (open) {
      getMediaDevices();
      // Default to mode selection when opening
      setCallState(CallState.MODE_SELECT);
    } else {
      stopRecording();
      setRecordingUrl(null);
    }
  }, [open]);

  useEffect(() => {
    if (callState === CallState.ACTIVE && open) {
      startRecording();
    }
  }, [callState, open]);

  const getMediaDevices = async () => {
    try {
      // Request permissions first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const microphones = devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`
        }));
      
      const speakers = devices
        .filter(device => device.kind === 'audiooutput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Speaker ${device.deviceId.slice(0, 5)}...`
        }));
      
      setAudioDevices(microphones);
      setOutputDevices(speakers);
      
      // Set defaults if not already set
      if (!selectedMicrophone && microphones.length > 0) {
        setMicrophone(microphones[0].deviceId);
      }
      
      if (!selectedSpeaker && speakers.length > 0) {
        setSpeaker(speakers[0].deviceId);
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Permission Error',
        description: 'Unable to access microphone. Please grant permission and try again.',
        variant: 'destructive',
      });
    }
  };

  const selectRolePlayMode = (mode: 'person' | 'ai') => {
    setRolePlayType(mode);
    if (mode === 'person') {
      setCallState(CallState.PERSON_SETUP);
    } else {
      setCallState(CallState.PERSONA_SELECT);
    }
  };

  const selectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const startCall = () => {
    setCallState(CallState.ACTIVE);
    toast({
      title: 'Call Started',
      description: 'Recording has started automatically.',
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined 
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordingUrl(audioUrl);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording. Please check your microphone.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const endCall = () => {
    stopRecording();
    setCallState(CallState.REVIEW);
    toast({
      title: 'Call Ended',
      description: 'Review your recording below.',
    });
  };

  const playRecording = () => {
    if (recordingUrl && audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        // Set the audio output device if supported
        if (selectedSpeaker && 'setSinkId' in HTMLMediaElement.prototype) {
          // TypeScript doesn't recognize setSinkId by default
          (audioPlayerRef.current as any).setSinkId(selectedSpeaker)
            .catch((err: any) => console.error('Error setting audio output:', err));
        }
        
        audioPlayerRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('Error playing audio:', err);
            toast({
              title: 'Playback Error',
              description: 'Failed to play recording.',
              variant: 'destructive',
            });
          });
      }
    }
  };

  const saveRecording = () => {
    if (recordingUrl) {
      const newRecording = {
        id: Date.now().toString(),
        title: `Call with ${agent.name} - ${new Date().toLocaleString()}`,
        url: recordingUrl,
        isTraining: true
      };
      
      setRecordings(prev => [newRecording, ...prev]);
      
      toast({
        title: 'Recording Saved',
        description: 'Recording has been saved and will be used for training.',
      });
      
      // Reset the state and go back to initial screen
      resetToInitialScreen();
    }
  };

  const retakeRecording = () => {
    setRecordingUrl(null);
    setCallState(CallState.ACTIVE);
    startRecording();
  };

  const discardRecording = () => {
    setRecordingUrl(null);
    resetToInitialScreen();
    
    toast({
      title: 'Recording Discarded',
      description: 'The recording has been discarded.',
    });
  };

  const resetToInitialScreen = () => {
    if (rolePlayMode === 'person') {
      setCallState(CallState.PERSON_SETUP);
    } else {
      setCallState(CallState.PERSONA_SELECT);
    }
  };

  const toggleTraining = (id: string) => {
    setRecordings(prev => prev.map(rec => 
      rec.id === id ? { ...rec, isTraining: !rec.isTraining } : rec
    ));
    
    toast({
      title: 'Training Status Updated',
      description: 'Recording training status has been updated.',
    });
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    
    toast({
      title: 'Recording Deleted',
      description: 'Recording has been permanently deleted.',
    });
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const resetFlow = () => {
    setCallState(CallState.MODE_SELECT);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Role Play with {agent?.name || 'Agent'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Mode Selection Screen */}
          {callState === CallState.MODE_SELECT && (
            <div className="flex flex-col items-center justify-center p-8 space-y-8">
              <h2 className="text-xl font-semibold text-center">How would you like to role play?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <Button 
                  variant="outline" 
                  className="p-8 h-auto flex flex-col items-center gap-4 hover:bg-secondary"
                  onClick={() => selectRolePlayMode('person')}
                >
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Role Play with Someone</h3>
                    <p className="text-muted-foreground">Call a real person to practice with</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="p-8 h-auto flex flex-col items-center gap-4 hover:bg-secondary"
                  onClick={() => selectRolePlayMode('ai')}
                >
                  <div className="h-16 w-16 bg-agent-primary/10 rounded-full flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-agent-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Role Play with AI</h3>
                    <p className="text-muted-foreground">Practice with AI-simulated personas</p>
                  </div>
                </Button>
              </div>
            </div>
          )}
          
          {/* Person Setup Screen */}
          {callState === CallState.PERSON_SETUP && (
            <div className="space-y-6 p-4">
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Enter Phone Number</h3>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="microphone">Microphone</Label>
                        <Select 
                          value={selectedMicrophone || ''} 
                          onValueChange={setMicrophone}
                        >
                          <SelectTrigger id="microphone">
                            <SelectValue placeholder="Select a microphone" />
                          </SelectTrigger>
                          <SelectContent>
                            {audioDevices.map(device => (
                              <SelectItem key={device.deviceId} value={device.deviceId}>
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="speaker">Speaker</Label>
                        <Select 
                          value={selectedSpeaker || ''} 
                          onValueChange={setSpeaker}
                        >
                          <SelectTrigger id="speaker">
                            <SelectValue placeholder="Select a speaker" />
                          </SelectTrigger>
                          <SelectContent>
                            {outputDevices.map(device => (
                              <SelectItem key={device.deviceId} value={device.deviceId}>
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={resetFlow}>
                        Back
                      </Button>
                      <Button onClick={startCall} disabled={!phoneNumber.trim()}>
                        Start Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {recordings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Previous Recordings</h3>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {recordings.map(recording => (
                        <div key={recording.id} className="flex items-center justify-between border p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{recording.title}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleTraining(recording.id)}
                              className={recording.isTraining ? "bg-green-100 text-green-800" : ""}
                            >
                              {recording.isTraining ? "In Training" : "Add to Training"}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteRecording(recording.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          
          {/* Persona Selection Screen */}
          {callState === CallState.PERSONA_SELECT && (
            <div className="space-y-6 p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Select a Persona to Practice With</h3>
                <div className="grid grid-cols-1 gap-3">
                  {personas.map(persona => (
                    <RadioGroup key={persona.id} value={selectedPersona} onValueChange={selectPersona}>
                      <div 
                        className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer ${selectedPersona === persona.id ? 'bg-secondary/50 border-agent-primary/30' : 'hover:bg-secondary/30'}`}
                        onClick={() => selectPersona(persona.id)}
                      >
                        <RadioGroupItem value={persona.id} id={`persona-${persona.id}`} />
                        <div className="flex flex-col space-y-1">
                          <Label htmlFor={`persona-${persona.id}`} className="text-base font-medium cursor-pointer">
                            {persona.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{persona.description}</p>
                        </div>
                      </div>
                    </RadioGroup>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <Label htmlFor="ai-microphone">Microphone</Label>
                  <Select 
                    value={selectedMicrophone || ''} 
                    onValueChange={setMicrophone}
                  >
                    <SelectTrigger id="ai-microphone">
                      <SelectValue placeholder="Select a microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioDevices.map(device => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="ai-speaker">Speaker</Label>
                  <Select 
                    value={selectedSpeaker || ''} 
                    onValueChange={setSpeaker}
                  >
                    <SelectTrigger id="ai-speaker">
                      <SelectValue placeholder="Select a speaker" />
                    </SelectTrigger>
                    <SelectContent>
                      {outputDevices.map(device => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={resetFlow}>
                  Back
                </Button>
                <Button onClick={startCall}>
                  Start Call with {personas.find(p => p.id === selectedPersona)?.name}
                </Button>
              </div>
              
              {recordings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Previous Recordings</h3>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {recordings.map(recording => (
                        <div key={recording.id} className="flex items-center justify-between border p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{recording.title}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleTraining(recording.id)}
                              className={recording.isTraining ? "bg-green-100 text-green-800" : ""}
                            >
                              {recording.isTraining ? "In Training" : "Add to Training"}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteRecording(recording.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          
          {/* Active Call Screen */}
          {callState === CallState.ACTIVE && (
            <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-6">
              <div className="h-24 w-24 bg-agent-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="h-10 w-10 text-agent-primary" />
              </div>
              
              <p className="text-xl font-medium">
                {rolePlayMode === 'person' 
                  ? `Call in progress with ${phoneNumber}` 
                  : `Call in progress with ${personas.find(p => p.id === selectedPersona)?.name}`
                }
              </p>
              <p className="text-muted-foreground">Recording is active...</p>
              
              <div className="space-x-4 mt-8">
                {isRecording ? (
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    onClick={stopRecording}
                    className="min-w-32"
                  >
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Recording
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="lg" 
                    onClick={startRecording}
                    className="min-w-32"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Resume Recording
                  </Button>
                )}
                
                <Button 
                  variant="destructive" 
                  size="lg" 
                  onClick={endCall}
                  className="min-w-32"
                >
                  End Call
                </Button>
              </div>
            </div>
          )}
          
          {/* Review Screen */}
          {callState === CallState.REVIEW && recordingUrl && (
            <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Great job!</h3>
                <p className="text-muted-foreground mt-2">
                  You're one call closer to a great and human AI agent. Review your recording below.
                </p>
              </div>
              
              <div className="w-full max-w-md p-6 border rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">
                    {rolePlayMode === 'person' 
                      ? `Call with ${phoneNumber}` 
                      : `Call with ${personas.find(p => p.id === selectedPersona)?.name}`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>
                
                <div className="flex justify-center my-6">
                  <Button 
                    variant={isPlaying ? "destructive" : "outline"} 
                    size="lg" 
                    onClick={playRecording}
                    className="min-w-40"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Play Recording
                      </>
                    )}
                  </Button>
                </div>
                
                <audio 
                  ref={audioPlayerRef} 
                  src={recordingUrl} 
                  onEnded={handleAudioEnded} 
                  className="hidden" 
                />
                
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <Button variant="outline" onClick={discardRecording} className="flex flex-col items-center py-6 h-auto gap-2">
                    <X className="h-5 w-5 text-red-500" />
                    <span>Discard</span>
                  </Button>
                  
                  <Button variant="outline" onClick={retakeRecording} className="flex flex-col items-center py-6 h-auto gap-2">
                    <RefreshCw className="h-5 w-5 text-amber-500" />
                    <span>Retake</span>
                  </Button>
                  
                  <Button onClick={saveRecording} className="flex flex-col items-center py-6 h-auto gap-2 bg-green-600 hover:bg-green-700">
                    <Check className="h-5 w-5" />
                    <span>Save & Train</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
