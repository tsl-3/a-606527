
import React, { useState } from "react";
import { 
  FlaskConical, Target, TrendingUp, Check, PlayCircle, 
  SkipForward, List, ArrowRight, Plus, CircleCheck,
  CheckCircle2, ChevronUp, Download, Rocket, FileText, Mic, Save,
  Upload, File, Minus, Edit2, Copy, Shuffle, Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TrainingScenario {
  id: string;
  name: string;
  completed: boolean;
}

interface SimulationResult {
  id: string;
  name: string;
  date: string;
  coverage: number;
  performance: number;
  scenarios: number;
  tokens: string;
}

interface SimulationItem {
  id: string;
  name: string;
  description: string;
  coverage: number;
  performance: number;
  tokenEstimate: number;
  scenariosCount: number;
  selected: boolean;
  scenarios: {
    id: string;
    name: string;
    description: string;
  }[];
}

interface PersonaTemplate {
  location: string;
  ageRange: string;
  gender: string;
  seekingFor: string;
}

interface SimulationCardProps {
  status: 'not-started' | 'in-progress' | 'completed';
  coverage?: number;
  performance?: number;
  scenarios?: TrainingScenario[];
  simulations?: SimulationResult[];
}

export const SimulationCard: React.FC<SimulationCardProps> = ({
  status,
  coverage = 0,
  performance = 0,
  scenarios = [],
  simulations = []
}) => {
  const [isExpanded, setIsExpanded] = useState(status !== 'completed');
  const [showPersonaForm, setShowPersonaForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [personasGenerated, setPersonasGenerated] = useState(false);
  const [showSimulationSelection, setShowSimulationSelection] = useState(false);
  const [availableSimulations, setAvailableSimulations] = useState<SimulationItem[]>([]);
  const [showScenarioDialog, setShowScenarioDialog] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationItem | null>(null);
  const [editingSimulationCount, setEditingSimulationCount] = useState(false);
  const [simulationCount, setSimulationCount] = useState(5);
  
  // Metrics for simulation selection display
  const [potentialCoverage, setPotentialCoverage] = useState(0);
  const [potentialPerformance, setPotentialPerformance] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalScenarios, setTotalScenarios] = useState(0);

  const isCoverageComplete = coverage >= 95;
  const isPerformanceComplete = performance >= 90;
  const isComplete = isCoverageComplete && isPerformanceComplete;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
      toast({
        title: "Files uploaded",
        description: `${filesArray.length} audio file${filesArray.length > 1 ? 's' : ''} uploaded successfully.`,
      });
    }
  };

  const handleSubmitRecordings = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one recording before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setPersonasGenerated(true);
      toast({
        title: "Personas generated",
        description: "Your recordings have been processed and personas have been generated successfully.",
      });
      
      // Generate mock available simulations after persona generation
      generateMockSimulations();
    }, 3000);
  };
  
  const generateMockSimulations = () => {
    // Mock data for available simulations
    const mockSimulations: SimulationItem[] = [
      {
        id: "1",
        name: "Customer Support Inquiry",
        description: "Test how your agent handles general customer support inquiries and information requests.",
        coverage: 25,
        performance: 15,
        tokenEstimate: 12000,
        scenariosCount: 5,
        selected: true,
        scenarios: [
          { id: "1-1", name: "New Customer Information Request", description: "A new customer asking about your services" },
          { id: "1-2", name: "Product Specifications", description: "Customer asking detailed product specifications" },
          { id: "1-3", name: "Service Availability", description: "Customer inquiring about service availability in their area" },
          { id: "1-4", name: "Pricing Information", description: "Customer asking about pricing and payment options" },
          { id: "1-5", name: "Company Policy", description: "Customer inquiring about company policies and guidelines" }
        ]
      },
      {
        id: "2",
        name: "Appointment Scheduling",
        description: "Test your agent's ability to schedule, reschedule, and cancel appointments.",
        coverage: 20,
        performance: 12,
        tokenEstimate: 8500,
        scenariosCount: 4,
        selected: true,
        scenarios: [
          { id: "2-1", name: "New Appointment Booking", description: "Customer wants to book a new appointment" },
          { id: "2-2", name: "Reschedule Existing Appointment", description: "Customer needs to change an appointment time" },
          { id: "2-3", name: "Cancel Appointment", description: "Customer wants to cancel their scheduled appointment" },
          { id: "2-4", name: "Appointment Confirmation", description: "Customer confirming details of an existing appointment" }
        ]
      },
      {
        id: "3",
        name: "Technical Troubleshooting",
        description: "Test how your agent handles technical issues and provides troubleshooting guidance.",
        coverage: 30,
        performance: 18,
        tokenEstimate: 15000,
        scenariosCount: 6,
        selected: true,
        scenarios: [
          { id: "3-1", name: "Basic Technical Issue", description: "Customer with a simple technical problem" },
          { id: "3-2", name: "Complex Technical Problem", description: "Customer with a complex technical issue requiring multiple steps" },
          { id: "3-3", name: "Service Outage", description: "Customer reporting a service outage or disruption" },
          { id: "3-4", name: "Login Issues", description: "Customer unable to log into their account" },
          { id: "3-5", name: "Mobile App Problem", description: "Customer experiencing issues with your mobile application" },
          { id: "3-6", name: "Website Navigation", description: "Customer having trouble navigating your website" }
        ]
      },
      {
        id: "4",
        name: "Billing and Payments",
        description: "Test your agent's ability to handle billing inquiries, payment processing, and financial concerns.",
        coverage: 15,
        performance: 10,
        tokenEstimate: 9000,
        scenariosCount: 4,
        selected: false,
        scenarios: [
          { id: "4-1", name: "Billing Question", description: "Customer with questions about their bill or statement" },
          { id: "4-2", name: "Payment Method Update", description: "Customer wanting to update their payment method" },
          { id: "4-3", name: "Disputed Charge", description: "Customer disputing a charge on their account" },
          { id: "4-4", name: "Payment Plan Request", description: "Customer requesting a payment plan for their balance" }
        ]
      },
      {
        id: "5",
        name: "Account Management",
        description: "Test your agent's ability to help customers manage their accounts, including registration and settings.",
        coverage: 18,
        performance: 12,
        tokenEstimate: 10000,
        scenariosCount: 5,
        selected: false,
        scenarios: [
          { id: "5-1", name: "Account Creation", description: "New customer setting up an account" },
          { id: "5-2", name: "Profile Updates", description: "Customer updating their profile information" },
          { id: "5-3", name: "Password Reset", description: "Customer needing to reset their password" },
          { id: "5-4", name: "Account Deletion", description: "Customer requesting account deletion" },
          { id: "5-5", name: "Preference Settings", description: "Customer changing account preferences and settings" }
        ]
      }
    ];
    
    setAvailableSimulations(mockSimulations);
    setShowSimulationSelection(true);
    
    // Calculate initial metrics
    calculateSimulationMetrics(mockSimulations);
  };
  
  const calculateSimulationMetrics = (sims: SimulationItem[]) => {
    const selectedSims = sims.filter(sim => sim.selected);
    
    const totalCoverage = selectedSims.reduce((acc, sim) => acc + sim.coverage, 0);
    const totalPerf = selectedSims.reduce((acc, sim) => acc + sim.performance, 0);
    const tokens = selectedSims.reduce((acc, sim) => acc + sim.tokenEstimate, 0);
    const scenarios = selectedSims.reduce((acc, sim) => acc + sim.scenariosCount, 0);
    
    // Cap at reasonable values
    setPotentialCoverage(Math.min(totalCoverage, 95));
    setPotentialPerformance(Math.min(totalPerf, 90));
    setTotalTokens(tokens);
    setTotalScenarios(scenarios);
  };
  
  const toggleSimulationSelection = (id: string) => {
    const updatedSimulations = availableSimulations.map(sim => 
      sim.id === id ? { ...sim, selected: !sim.selected } : sim
    );
    
    setAvailableSimulations(updatedSimulations);
    calculateSimulationMetrics(updatedSimulations);
  };
  
  const viewSimulationScenarios = (simulation: SimulationItem) => {
    setSelectedSimulation(simulation);
    setShowScenarioDialog(true);
  };
  
  const startSimulations = () => {
    const selectedCount = availableSimulations.filter(sim => sim.selected).length;
    
    if (selectedCount === 0) {
      toast({
        title: "No simulations selected",
        description: "Please select at least one simulation to continue.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Simulations started",
      description: `Running ${selectedCount} simulations with ${totalScenarios} scenarios.`,
    });
    
    // Here we would transition to in-progress state
    // For demo purposes, we'll just close the selection UI
    setShowSimulationSelection(false);
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 text-gray-900 dark:text-white">
              4
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Simulations</h3>
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
            {status === 'in-progress' && <span className="text-sm text-gray-500 dark:text-gray-400">{Math.min(Math.max(coverage, performance), 90)}%</span>}
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
          Test your agent's performance through different scenarios to ensure it can handle real-world interactions
        </p>
        
        {status !== 'not-started' && (
          <Progress 
            value={status === 'completed' ? 100 : Math.min(Math.max(coverage, performance), 90)} 
            className="h-1.5 mb-6" 
          />
        )}
        
        {isExpanded && (
          <>
            {status === 'not-started' && !personasGenerated && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
                <div className="text-center mb-8">
                  <FlaskConical className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Define Your User Personas</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Before running simulations, let's understand your target users. Submit recordings of past calls for analysis or describe your users.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">Written Description</h5>
                    </div>
                    <Textarea
                      placeholder="Example: Our users are professionals aged 25-40 from urban areas in the US, predominantly female (65%), seeking productivity tools for remote work management."
                      className="mb-4 h-32"
                    />
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Submit Description
                    </Button>
                  </div>

                  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="h-5 w-5 text-indigo-500" />
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">Upload Call Recordings</h5>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-4">
                      {uploadedFiles.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-indigo-500" />
                                <span className="text-sm truncate max-w-[160px]">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => removeFile(index)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 mb-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Drag and drop call recordings or click to browse
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Supports MP3, WAV, M4A files (max 50MB)
                          </p>
                        </div>
                      )}
                      
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          accept=".mp3,.wav,.m4a,audio/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleFileUpload}
                        />
                        <Button variant="outline" className="w-full gap-2">
                          <Upload className="h-4 w-4" />
                          {uploadedFiles.length > 0 ? "Add More Files" : "Browse Files"}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full gap-2" 
                      onClick={handleSubmitRecordings}
                      disabled={uploadedFiles.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Generate Personas
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white gap-2"
                    disabled={!personasGenerated}
                  >
                    <Plus className="h-4 w-4" />
                    Create Simulation
                  </Button>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-500" 
                    disabled={!personasGenerated}
                  >
                    <Rocket className="h-4 w-4" />
                    Generate Recommended Simulations
                  </Button>
                </div>
              </div>
            )}

            {/* Simulation Selection UI after personas are generated */}
            {status === 'not-started' && personasGenerated && showSimulationSelection && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-indigo-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Available Simulations</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
                      <Shuffle className="h-3.5 w-3.5" />
                      <span className="text-xs">Regenerate</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-xs">Create Custom</span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-medium">Potential Coverage</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{potentialCoverage}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Target: 95%</div>
                    </div>
                    <div className="mt-3">
                      <Progress value={(potentialCoverage / 95) * 100} className="h-1.5" />
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Estimated Performance</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{potentialPerformance}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Target: 90%</div>
                    </div>
                    <div className="mt-3">
                      <Progress value={(potentialPerformance / 90) * 100} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-600 dark:text-gray-400">
                        <FlaskConical className="h-3.5 w-3.5" />
                        <span>Simulations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{availableSimulations.filter(s => s.selected).length}</div>
                        <div onClick={() => setEditingSimulationCount(true)} className="cursor-pointer bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                          <Edit2 className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div>
                      {editingSimulationCount ? (
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setSimulationCount(Math.max(1, simulationCount - 1))}>
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <div className="text-gray-900 dark:text-white font-medium w-6 text-center">{simulationCount}</div>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setSimulationCount(simulationCount + 1)}>
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 ml-1" onClick={() => setEditingSimulationCount(false)}>
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">of {availableSimulations.length} available</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-600 dark:text-gray-400">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                      </svg>
                      <span>Scenarios</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{totalScenarios}</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-600 dark:text-gray-400">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>Estimated Tokens</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{(totalTokens / 1000).toFixed(1)}k</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto">
                  {availableSimulations.map((sim) => (
                    <div key={sim.id} className={`border ${sim.selected ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'} rounded-lg p-4 transition-colors`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="pt-0.5">
                            <Switch
                              checked={sim.selected}
                              onCheckedChange={() => toggleSimulationSelection(sim.id)}
                            />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{sim.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{sim.description}</p>
                          </div>
                        </div>
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => viewSimulationScenarios(sim)}>
                                <List className="h-4 w-4 mr-2" />
                                View Scenarios
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="pl-10">
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Target className="h-3 w-3" />
                            <span>Coverage: +{sim.coverage}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <TrendingUp className="h-3 w-3" />
                            <span>Performance: +{sim.performance}%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                            </svg>
                            <span>{sim.scenarios.length} scenarios</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            <span>{(sim.tokenEstimate / 1000).toFixed(1)}k tokens</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2">
                    <SkipForward className="h-4 w-4" />
                    Skip
                  </Button>
                  <Button className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-indigo-500" onClick={startSimulations}>
                    <PlayCircle className="h-4 w-4" />
                    Run Simulations
                  </Button>
                </div>
              </div>
            )}

            {status === 'in-progress' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-medium">Coverage</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{coverage}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Target: 95%</div>
                    </div>
                    <div className="mt-3">
                      <Progress value={coverage} className="h-1.5" />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Performance</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{performance}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Target: 90%</div>
                    </div>
                    <div className="mt-3">
                      <Progress value={performance} className="h-1.5" />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                      <ArrowRight className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Progress: {coverage}% coverage achieved</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Run more simulations to reach the target coverage of 95% and performance of 90%.</p>
                    </div>
                  </div>
                </div>
                
                {/* Training Scenarios Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <List className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Training Scenarios</h4>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {scenarios.map((scenario) => (
                      <div key={scenario.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-3 flex items-center">
                        <div className={`rounded-full p-1 mr-3 ${scenario.completed ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                          {scenario.completed ? <CircleCheck className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{scenario.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">Coverage Potential</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current: {coverage}% → {coverage + 12}%</span>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">+12%</Badge>
                      </div>
                      <Progress className="h-1.5 mt-2" value={(coverage / (coverage + 12)) * 100} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">Estimated Improvement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expected</span>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">+3%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <PlayCircle className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Simulations</span>
                      </div>
                      <div className="text-3xl font-bold text-indigo-500">
                        {simulations.length}
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Tokens</span>
                      </div>
                      <div className="text-3xl font-bold text-indigo-500">
                        50.0k
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1 gap-2">
                      <SkipForward className="h-4 w-4" />
                      Skip
                    </Button>
                    <Button className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-indigo-500">
                      <PlayCircle className="h-4 w-4" />
                      Run
                    </Button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Recent Simulations</h4>
                  <div className="space-y-2">
                    {simulations.map((sim) => (
                      <div key={sim.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium text-gray-900 dark:text-white">{sim.name}</div>
                          <div className="text-xs text-gray-500">{sim.date}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Coverage: {sim.coverage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Performance: {sim.performance}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FlaskConical className="h-3 w-3" />
                              <span>{sim.scenarios} scenarios</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                              <span>{sim.tokens} tokens</span>
                            </div>
                          </div>
                          <div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {status === 'completed' && (
              <>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-gray-900 dark:text-white">Completed: Agent simulations finished</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your agent has been thoroughly tested and has met all performance requirements.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-medium">Coverage</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
                      <div className="text-xs text-green-500">✓ Exceeds 95% target</div>
                    </div>
                    <div className="mt-3">
                      <Progress value={98} className="h-1.5" />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-800/50 flex flex-col">
                    <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Performance</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
                      <div className="text-xs text-green-500">✓ Exceeds 90% target</div>
                    </div>
                    <div className="mt-3">
                      <Progress value={95} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                {/* Training Scenarios Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <List className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Training Scenarios (8/8 Complete)</h4>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {[
                      { id: "1", name: "Product Information Requests", completed: true },
                      { id: "2", name: "Account Management", completed: true },
                      { id: "3", name: "Billing Questions", completed: true },
                      { id: "4", name: "Service Status Updates", completed: true },
                      { id: "5", name: "Technical Troubleshooting", completed: true },
                      { id: "6", name: "Feature Inquiries", completed: true },
                      { id: "7", name: "Returns and Refunds", completed: true },
                      { id: "8", name: "Subscription Management", completed: true }
                    ].map((scenario) => (
                      <div key={scenario.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-3 flex items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500 rounded-full p-1 mr-3">
                          <CircleCheck className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{scenario.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Completed Simulations</h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: "1",
                        name: "Basic Customer Inquiries",
                        date: "Mar 03, 2024",
                        coverage: 98,
                        performance: 95,
                        scenarios: 8,
                        tokens: "60.5k"
                      },
                      {
                        id: "2",
                        name: "Advanced Technical Support",
                        date: "Mar 02, 2024",
                        coverage: 96,
                        performance: 92,
                        scenarios: 6,
                        tokens: "45.2k"
                      },
                      {
                        id: "3",
                        name: "Billing Dispute Resolution",
                        date: "Mar 01, 2024",
                        coverage: 95,
                        performance: 91,
                        scenarios: 5,
                        tokens: "38.7k"
                      }
                    ].map((sim) => (
                      <div key={sim.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium text-gray-900 dark:text-white">{sim.name}</div>
                          <div className="text-xs text-gray-500">{sim.date}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Coverage: {sim.coverage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Performance: {sim.performance}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FlaskConical className="h-3 w-3" />
                              <span>{sim.scenarios} scenarios</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                              <span>{sim.tokens} tokens</span>
                            </div>
                          </div>
                          <div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Simulation Statistics</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <PlayCircle className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Simulations</span>
                      </div>
                      <div className="text-3xl font-bold text-indigo-500">
                        32
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Tokens</span>
                      </div>
                      <div className="text-3xl font-bold text-indigo-500">
                        144.4k
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <PlayCircle className="h-4 w-4" />
                    Run Additional Simulations
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {/* Dialog for viewing scenarios */}
      <Dialog open={showScenarioDialog} onOpenChange={setShowScenarioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-indigo-500" />
              <span>{selectedSimulation?.name} Scenarios</span>
            </DialogTitle>
            <DialogDescription>
              This simulation includes {selectedSimulation?.scenarios.length} scenarios that will test different aspects of your agent's capabilities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 my-4 max-h-[400px] overflow-y-auto">
            {selectedSimulation?.scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 dark:text-white mb-1">{scenario.name}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{scenario.description}</p>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScenarioDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const Circle = ({ className = "", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

