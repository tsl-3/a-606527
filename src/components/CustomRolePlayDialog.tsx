
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, MicOff, Save, Trash, Volume2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AgentType } from '@/types/agent';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface RolePlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentType;
  selectedMicrophone: string | null;
  selectedSpeaker: string | null;
  setMicrophone: (deviceId: string) => void;
  setSpeaker: (deviceId: string) => void;
}

interface MediaDevice {
  deviceId: string;
  label: string;
}

enum CallState {
  IDLE = 'idle',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const CustomRolePlayDialog = ({
  open,
  onOpenChange,
  agent,
  selectedMicrophone,
  selectedSpeaker,
  setMicrophone,
  setSpeaker
}: RolePlayDialogProps) => {
  const { toast } = useToast();
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDevice[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [callState, setCallState] = useState<CallState>(CallState.IDLE);
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (open) {
      getMediaDevices();
    } else {
      stopRecording();
      setCallState(CallState.IDLE);
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
    setCallState(CallState.COMPLETED);
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
      
      // Reset the state
      setCallState(CallState.IDLE);
      setRecordingUrl(null);
    }
  };

  const redoRecording = () => {
    setRecordingUrl(null);
    setCallState(CallState.IDLE);
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
          {callState === CallState.IDLE && (
            <div className="space-y-6 p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={agent?.avatar} alt={agent?.name} />
                  <AvatarFallback className="bg-agent-primary/20">
                    {agent?.name?.substring(0, 2) || 'AG'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-semibold">{agent?.name}</h2>
                  <p className="text-muted-foreground">{agent?.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="persona">Select Persona</Label>
                  <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                    <SelectTrigger id="persona">
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map(persona => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {personas.find(p => p.id === selectedPersona)?.description}
                  </p>
                </div>
                
                <div className="space-y-4">
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
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" onClick={startCall} className="w-1/2">
                  Start Call
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
          
          {callState === CallState.ACTIVE && (
            <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-6">
              <div className="h-24 w-24 bg-agent-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="h-10 w-10 text-agent-primary" />
              </div>
              
              <p className="text-xl font-medium">Call in progress with {agent?.name}</p>
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
          
          {callState === CallState.COMPLETED && recordingUrl && (
            <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-6">
              <h3 className="text-xl font-medium">Call Recording</h3>
              
              <div className="w-full max-w-md p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">Call with {agent?.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>
                
                <div className="flex justify-center my-4">
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
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={redoRecording} className="min-w-32">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-record
                  </Button>
                  
                  <Button onClick={saveRecording} className="min-w-32">
                    <Save className="mr-2 h-4 w-4" />
                    Save & Train
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
