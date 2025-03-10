import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, MicOff, Save, Trash, Volume2, RefreshCw, Phone, User, Rocket, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AgentType } from '@/types/agent';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
  PERSON_SETUP = 'person_setup',
  PERSONA_SELECT = 'persona_select',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REVIEW = 'review',
}

const personas = [
  { id: '1', name: 'Customer', description: 'A standard customer calling for help' },
  { id: '2', name: 'Angry Customer', description: 'A frustrated customer with a problem' },
  { id: '3', name: 'New User', description: 'Someone unfamiliar with your product' },
  { id: '4', name: 'Technical User', description: 'Someone with technical knowledge' },
];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Role Play with {agent?.name || 'Agent'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Mode Selection Screen - Only 2 options */}
          {callState === CallState.MODE_SELECT && (
            <div className="flex flex-col items-center justify-center p-8 space-y-8">
              <h2 className="text-xl font-semibold text-center">Choose a role-play option</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <Button 
                  variant="outline" 
                  className="p-8 h-auto flex flex-col items-center gap-4 hover:bg-secondary"
                  onClick={() => selectRolePlayMode('person')}
                >
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Role-Play Call</h3>
                    <p className="text-muted-foreground">Start a voice call session with a real person</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="p-8 h-auto flex flex-col items-center gap-4 hover:bg-secondary"
                  onClick={() => selectRolePlayMode('ai')}
                >
                  <div className="h-16 w-16 bg-agent-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-agent-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">User Personas</h3>
                    <p className="text-muted-foreground">Practice with pre-generated customer personas</p>
                  </div>
                </Button>
              </div>
            </div>
          )}
          
          {/* Person Setup Screen */}
          {callState === CallState.PERSON_SETUP && (
            <div className="space-y-6 p-4">
              <Card>
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
                        <Label>Microphone</Label>
                        <Select value={selectedMicrophone || ''} onValueChange={setMicrophone}>
                          <SelectTrigger>
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
                        <Label>Speaker</Label>
                        <Select value={selectedSpeaker || ''} onValueChange={setSpeaker}>
                          <SelectTrigger>
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
                      <Button variant="outline" onClick={() => setCallState(CallState.MODE_SELECT)}>
                        Back
                      </Button>
                      <Button onClick={() => setCallState(CallState.ACTIVE)} disabled={!phoneNumber.trim()}>
                        Start Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Persona Selection Screen */}
          {callState === CallState.PERSONA_SELECT && (
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-1 gap-4">
                {personas.map(persona => (
                  <div 
                    key={persona.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedPersona === persona.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedPersona(persona.id)}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value={persona.id} id={`persona-${persona.id}`} className="mt-1" />
                      <div>
                        <Label className="text-lg font-medium">{persona.name}</Label>
                        <p className="text-muted-foreground mt-1">{persona.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Microphone</Label>
                      <Select value={selectedMicrophone || ''} onValueChange={setMicrophone}>
                        <SelectTrigger>
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
                      <Label>Speaker</Label>
                      <Select value={selectedSpeaker || ''} onValueChange={setSpeaker}>
                        <SelectTrigger>
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
                    <Button variant="outline" onClick={() => setCallState(CallState.MODE_SELECT)}>
                      Back
                    </Button>
                    <Button onClick={() => setCallState(CallState.ACTIVE)}>
                      Start Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
              
              <div className="space-x-4">
                <Button 
                  variant="destructive"
                  size="lg"
                  onClick={() => {
                    stopRecording();
                    setCallState(CallState.REVIEW);
                  }}
                >
                  End Call
                </Button>
              </div>
            </div>
          )}
          
          {/* Review Screen */}
          {callState === CallState.REVIEW && (
            <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Great job!</h3>
                <p className="text-muted-foreground mt-2">
                  You're one call closer to a great and human AI agent. Review your recording below.
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <Button 
                  variant={isPlaying ? "destructive" : "outline"} 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    if (isPlaying) {
                      if (audioPlayerRef.current) {
                        audioPlayerRef.current.pause();
                      }
                      setIsPlaying(false);
                    } else {
                      if (audioPlayerRef.current && recordingUrl) {
                        audioPlayerRef.current.src = recordingUrl;
                        audioPlayerRef.current.play();
                        setIsPlaying(true);
                      }
                    }
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause Recording
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Play Recording
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Button variant="outline" onClick={() => {
                    setRecordingUrl(null);
                    setCallState(rolePlayMode === 'person' ? CallState.PERSON_SETUP : CallState.PERSONA_SELECT);
                  }} className="flex flex-col items-center py-6 h-auto">
                    <X className="h-5 w-5 text-red-500 mb-2" />
                    <span>Discard</span>
                  </Button>
                  
                  <Button variant="outline" onClick={() => {
                    setRecordingUrl(null);
                    setCallState(CallState.ACTIVE);
                  }} className="flex flex-col items-center py-6 h-auto">
                    <RefreshCw className="h-5 w-5 text-amber-500 mb-2" />
                    <span>Retake</span>
                  </Button>
                  
                  <Button onClick={() => {
                    // Save recording logic
                    toast({
                      title: "Recording saved",
                      description: "Your recording has been saved and will be used for training."
                    });
                    setCallState(rolePlayMode === 'person' ? CallState.PERSON_SETUP : CallState.PERSONA_SELECT);
                  }} className="flex flex-col items-center py-6 h-auto bg-green-600 hover:bg-green-700">
                    <Check className="h-5 w-5 mb-2" />
                    <span>Save & Train</span>
                  </Button>
                </div>
              </div>
              
              <audio ref={audioPlayerRef} className="hidden" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
