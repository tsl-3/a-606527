
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AgentType } from "@/types/agent";
import { Mic, Phone, PhoneOutgoing, PhoneIncoming, MessageSquare, Robot, Rocket, Cog } from "lucide-react";

interface TestAgentSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentType | null;
  onStartRolePlay: () => void;
  onStartDirectCall: (phoneNumber: string, deviceSettings: { mic: string; speaker: string }) => void;
  onStartChat: () => void;
}

export const TestAgentSidebar: React.FC<TestAgentSidebarProps> = ({
  open,
  onOpenChange,
  agent,
  onStartRolePlay,
  onStartDirectCall,
  onStartChat
}) => {
  const [activeTab, setActiveTab] = useState<string>("voice");
  const [callType, setCallType] = useState<"inbound" | "outbound">("inbound");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([]);
  const [availableSpeakers, setAvailableSpeakers] = useState<MediaDeviceInfo[]>([]);

  // Get available audio devices
  React.useEffect(() => {
    if (open) {
      const getDevices = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
              stream.getTracks().forEach((track) => track.stop());
            });

          const devices = await navigator.mediaDevices.enumerateDevices();
          const mics = devices.filter(device => device.kind === "audioinput");
          const speakers = devices.filter(device => device.kind === "audiooutput");
          
          setAvailableMics(mics);
          setAvailableSpeakers(speakers);
          
          if (mics.length > 0) setSelectedMic(mics[0].deviceId);
          if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);
        } catch (error) {
          console.error("Error accessing media devices:", error);
        }
      };
      
      getDevices();

      // Listen for device changes
      const deviceChangeHandler = () => getDevices();
      navigator.mediaDevices.addEventListener('devicechange', deviceChangeHandler);
      
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', deviceChangeHandler);
      };
    }
  }, [open]);

  const handleStartInboundCall = () => {
    onStartDirectCall(agent?.channelConfigs?.voice?.details || "+1 (800) 555-1234", {
      mic: selectedMic,
      speaker: selectedSpeaker
    });
    onOpenChange(false);
  };

  const handleStartOutboundCall = () => {
    if (phoneNumber) {
      onStartDirectCall(phoneNumber, {
        mic: selectedMic,
        speaker: selectedSpeaker
      });
      onOpenChange(false);
    }
  };

  const handleStartRolePlay = () => {
    onStartRolePlay();
    onOpenChange(false);
  };

  const handleStartChat = () => {
    onStartChat();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="space-y-2 mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Test Agent
          </SheetTitle>
          <SheetDescription>
            Choose how you want to test and interact with your agent.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="space-y-4">
            <div className="grid gap-4 mb-4">
              <Card className="p-4">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <Robot className="h-4 w-4 text-primary" />
                  RolePlay
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Simulate a conversation with the agent using pre-defined personas and scenarios.
                </p>
                <Button onClick={handleStartRolePlay} size="sm" className="w-full">
                  Start RolePlay
                </Button>
              </Card>

              {callType === "inbound" ? (
                <Card className="p-4">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <PhoneIncoming className="h-4 w-4 text-green-500" />
                    Inbound Call
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulate as if you're calling the agent. The agent will answer your call.
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="grid gap-2">
                      <Label htmlFor="mic-input">Microphone</Label>
                      <Select value={selectedMic} onValueChange={setSelectedMic}>
                        <SelectTrigger id="mic-input">
                          <SelectValue placeholder="Select microphone" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMics.map((mic) => (
                            <SelectItem key={mic.deviceId} value={mic.deviceId}>
                              {mic.label || `Microphone ${mic.deviceId.slice(0, 5)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="speaker-output">Speaker</Label>
                      <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                        <SelectTrigger id="speaker-output">
                          <SelectValue placeholder="Select speaker" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSpeakers.map((speaker) => (
                            <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                              {speaker.label || `Speaker ${speaker.deviceId.slice(0, 5)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={handleStartInboundCall} className="w-full">
                    Start Inbound Call
                  </Button>
                </Card>
              ) : (
                <Card className="p-4">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                    Outbound Call
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulate the agent calling a specific phone number (you).
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="mic-input">Microphone</Label>
                      <Select value={selectedMic} onValueChange={setSelectedMic}>
                        <SelectTrigger id="mic-input">
                          <SelectValue placeholder="Select microphone" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMics.map((mic) => (
                            <SelectItem key={mic.deviceId} value={mic.deviceId}>
                              {mic.label || `Microphone ${mic.deviceId.slice(0, 5)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="speaker-output">Speaker</Label>
                      <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                        <SelectTrigger id="speaker-output">
                          <SelectValue placeholder="Select speaker" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSpeakers.map((speaker) => (
                            <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                              {speaker.label || `Speaker ${speaker.deviceId.slice(0, 5)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleStartOutboundCall} 
                    className="w-full"
                    disabled={!phoneNumber}
                  >
                    Start Outbound Call
                  </Button>
                </Card>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <RadioGroup value={callType} onValueChange={(value: "inbound" | "outbound") => setCallType(value)} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inbound" id="inbound" />
                    <Label htmlFor="inbound" className="cursor-pointer">Inbound Call</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outbound" id="outbound" />
                    <Label htmlFor="outbound" className="cursor-pointer">Outbound Call</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4">
            <Card className="p-4">
              <div className="font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Chat Interface
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Start a text-based conversation with your agent to test responses.
              </p>
              
              <Button onClick={handleStartChat} className="w-full">
                Start Chat
              </Button>
            </Card>
            
            <div className="text-sm text-muted-foreground">
              <p>In a chat interface you can:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Test how your agent responds to different text queries</li>
                <li>Evaluate the quality of the agent's responses</li>
                <li>Test specific scenarios or edge cases</li>
                <li>Refine your agent's knowledge and responses</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)} 
            className="w-full"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
