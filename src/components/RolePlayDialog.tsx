
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Search, Users, UserRound, MessageCircle, Brain, ArrowRight, Send } from "lucide-react";

// Sample persona data - in a real application, this would be generated dynamically
const samplePersonas = [
  { id: 1, name: "Emily", role: "Product Manager", avatar: "E", description: "Focused on feature prioritization and roadmap planning" },
  { id: 2, name: "Michael", role: "IT Support", avatar: "M", description: "Technical support specialist with hardware expertise" },
  { id: 3, name: "Sarah", role: "Customer Success", avatar: "S", description: "Helps customers achieve their goals with the product" },
  { id: 4, name: "David", role: "Finance Manager", avatar: "D", description: "Handles budgeting and financial planning inquiries" },
  { id: 5, name: "Jessica", role: "HR Representative", avatar: "J", description: "Specializes in employee benefits and policies" },
  { id: 6, name: "Robert", role: "Sales Representative", avatar: "R", description: "Focuses on addressing prospect questions and concerns" },
  { id: 7, name: "Amanda", role: "Marketing Specialist", avatar: "A", description: "Expert in digital marketing strategies" },
  { id: 8, name: "James", role: "Operations Manager", avatar: "J", description: "Focuses on operational efficiency and processes" },
  { id: 9, name: "Lisa", role: "Legal Advisor", avatar: "L", description: "Provides guidance on legal and compliance matters" },
  { id: 10, name: "Thomas", role: "Product Support", avatar: "T", description: "Technical product expert for troubleshooting" },
];

interface Message {
  id: string;
  sender: 'user' | 'persona';
  text: string;
  timestamp: Date;
}

export const RolePlayDialog = ({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) => {
  // State for different stages of the role-play flow
  const [stage, setStage] = useState<'selection' | 'persona-setup' | 'persona-list' | 'chat'>('selection');
  const [personaDescription, setPersonaDescription] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<typeof samplePersonas[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [knowledgeResults, setKnowledgeResults] = useState<string[]>([]);

  // Handle option selection
  const handleOptionSelect = (option: 'someone' | 'personas') => {
    if (option === 'someone') {
      // For this demo, we'll just populate a random persona
      const randomPersona = samplePersonas[Math.floor(Math.random() * samplePersonas.length)];
      setSelectedPersona(randomPersona);
      setStage('chat');
      // Add initial greeting message
      setMessages([
        {
          id: '1',
          sender: 'persona',
          text: `Hi there! I'm ${randomPersona.name}, ${randomPersona.role}. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
    } else {
      setStage('persona-setup');
    }
  };

  // Handle generating personas based on description
  const handleGeneratePersonas = () => {
    // In a real application, this would call an AI service to generate personas based on the description
    // For this demo, we'll just use the sample data
    setStage('persona-list');
  };

  // Handle selecting a persona from the list
  const handlePersonaSelect = (persona: typeof samplePersonas[0]) => {
    setSelectedPersona(persona);
    setStage('chat');
    // Add initial greeting message
    setMessages([
      {
        id: '1',
        sender: 'persona',
        text: `Hi there! I'm ${persona.name}, ${persona.role}. How can I assist you today?`,
        timestamp: new Date(),
      },
    ]);
  };

  // Handle sending a message in the chat
  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;

    // Add user message to the chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newUserMessage]);
    setCurrentMessage('');

    // In a real application, this would call an AI service to generate a response
    // For this demo, we'll simulate a response after a delay
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

  // Handle searching the knowledge base
  const handleKnowledgeSearch = () => {
    if (searchQuery.trim() === '') return;

    // In a real application, this would search an actual knowledge base
    // For this demo, we'll simulate results
    setKnowledgeResults([
      `Article about "${searchQuery}" from the knowledge base.`,
      `FAQ entry related to "${searchQuery}".`,
      `Best practices for handling "${searchQuery}" situations.`,
    ]);
  };

  // Reset function when closing the dialog
  const handleClose = () => {
    setStage('selection');
    setPersonaDescription('');
    setSelectedPersona(null);
    setMessages([]);
    setCurrentMessage('');
    setSearchQuery('');
    setKnowledgeResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        {stage === 'selection' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Role-Play Session</DialogTitle>
              <DialogDescription>
                Choose a role-play option to start training your agent
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
              <div 
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-primary/50 hover:bg-primary/5 cursor-pointer flex flex-col items-center text-center transition-all"
                onClick={() => handleOptionSelect('someone')}
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Role-Play with Someone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start a session with a randomly selected persona to simulate real conversations
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
                  Define customer types and generate personas for targeted training
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

        {stage === 'chat' && selectedPersona && (
          <>
            <DialogHeader className="border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                  {selectedPersona.avatar}
                </div>
                <div>
                  <DialogTitle className="text-xl">{selectedPersona.name}</DialogTitle>
                  <DialogDescription className="text-sm">
                    {selectedPersona.role}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden py-4">
              {/* Chat section */}
              <div className="flex-1 flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p>{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Knowledge base section */}
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
      </DialogContent>
    </Dialog>
  );
};
