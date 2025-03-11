
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Bot, Mic, PauseCircle, StopCircle, Volume2, Loader2, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LiveTranscription } from "./LiveTranscription";

export interface RolePlayDialogProps {
  agentId?: string;
  agentName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const RolePlayDialog: React.FC<RolePlayDialogProps> = ({
  agentId,
  agentName = "Agent",
  open,
  onOpenChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use either the controlled state or internal state
  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange || setIsOpen;
  
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setIsSending(true);
    setTimeout(() => {
      // Simulate API call
      setIsSending(false);
      // Add response handling here
      setInputValue("");
    }, 1000);
  };
  
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };
  
  const avatarUrl = agentId ? `https://api.dicebear.com/7.x/bottts/svg?seed=${agentId}` : "";
  
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 shadow-lg" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
              <AvatarImage src={avatarUrl} alt={agentName} />
              <AvatarFallback className="bg-agent-primary/20 text-agent-primary">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{agentName || "Agent"}</DialogTitle>
              <DialogDescription>Test your agent with real-time interactions</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs
          defaultValue="text"
          className="flex flex-col flex-1"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="px-4 pt-2 justify-start bg-transparent border-b rounded-none gap-2">
            <TabsTrigger value="text" className="data-[state=active]:bg-secondary">
              <MessageSquare className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-secondary">
              <Mic className="h-4 w-4 mr-2" />
              Voice
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={agentName} />
                  <AvatarFallback className="bg-agent-primary/20 text-agent-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">
                    Hello! I'm {agentName}, your AI assistant. How can I help you today?
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <TabsContent value="text" className="m-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="m-0">
              <div className="space-y-3">
                {isRecording && (
                  <LiveTranscription text="Recording transcription will appear here in real-time..." />
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full border-red-500 text-red-500"
                          onClick={handleRecordToggle}
                        >
                          <PauseCircle className="h-5 w-5" />
                        </Button>
                        <span className="text-sm text-red-500 animate-pulse">Recording...</span>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={handleRecordToggle}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handlePlayToggle}
                      >
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handlePlayToggle}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
