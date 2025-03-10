
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Upload, Play, Check, FileAudio, X, ChevronRight, Users, Target, PlayCircle, Percent, Zap, Bot, BrainCircuit, PenLine, Users2, Phone, Building, FileText, Database, Lightbulb, BarChart } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface SimulationStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Simulation {
  id: string;
  title: string;
  description: string;
  scenarios: string[];
  coverage: number;
  performance: number;
  tokens: number;
}

interface SimulationStepsProps {
  onComplete: (data: any) => void;
  initialStatus?: 'not-started' | 'in-progress' | 'completed';
  coverage?: number;
  performance?: number;
  scenarios?: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
  simulations?: Array<{
    id: string;
    name: string;
    date: string;
    coverage: number;
    performance: number;
    scenarios: number;
    tokens: string;
  }>;
}

const STEPS: SimulationStep[] = [
  {
    title: "Generate Personas",
    description: "Upload call recordings or describe your customer personas",
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Select Simulations",
    description: "Choose and customize simulation scenarios",
    icon: <Target className="h-5 w-5" />
  },
  {
    title: "Review & Run",
    description: "Confirm settings and start simulations",
    icon: <PlayCircle className="h-5 w-5" />
  }
];

const SIMULATION_INSIGHTS = [
  "Analyzing agent purpose and industry context...",
  "Extracting key user personas from data...",
  "Identifying common interaction patterns...",
  "Processing call recordings for tone and content...",
  "Mapping customer journey touchpoints...",
  "Designing scenarios for maximum coverage...",
  "Calibrating difficulty levels across scenarios...",
  "Optimizing for performance metrics...",
  "Generating diverse conversation flows...",
  "Creating edge cases for thorough testing...",
  "Finalizing simulation parameters..."
];

const EXPANDED_SIMULATIONS: Simulation[] = [
  {
    id: "1",
    title: "Schedule Appointment",
    description: "Test appointment scheduling flow",
    scenarios: [
      "New customer scheduling first appointment",
      "Angry customer rescheduling",
      "Customer with poor connection",
      "Customer hanging up mid-conversation",
      "Customer with background noise"
    ],
    coverage: 35,
    performance: 40,
    tokens: 2500
  },
  {
    id: "2",
    title: "Product Inquiry",
    description: "Handle product-related questions",
    scenarios: [
      "Technical product questions",
      "Price comparisons",
      "Feature inquiries",
      "Product availability check"
    ],
    coverage: 25,
    performance: 30,
    tokens: 2000
  },
  {
    id: "3",
    title: "Troubleshooting",
    description: "Resolve technical issues and customer problems",
    scenarios: [
      "Basic troubleshooting steps",
      "Complex technical problem",
      "Frustrated customer with recurring issue",
      "Service outage explanation"
    ],
    coverage: 20,
    performance: 25,
    tokens: 1800
  },
  {
    id: "4",
    title: "Billing Questions",
    description: "Handle payment and invoice inquiries",
    scenarios: [
      "Billing cycle explanation",
      "Disputed charge",
      "Payment method update",
      "Invoice request",
      "Late payment discussion"
    ],
    coverage: 15,
    performance: 20,
    tokens: 1700
  },
  {
    id: "5",
    title: "Order Status",
    description: "Provide updates on order processing and delivery",
    scenarios: [
      "Check order status",
      "Delivery delay explanation",
      "Order modification request",
      "Lost package handling"
    ],
    coverage: 18,
    performance: 22,
    tokens: 1900
  },
  {
    id: "6",
    title: "Returns and Refunds",
    description: "Process return requests and issue refunds",
    scenarios: [
      "Return policy explanation",
      "Damaged product return",
      "Refund status inquiry",
      "Exchange process"
    ],
    coverage: 12,
    performance: 18,
    tokens: 1600
  },
  {
    id: "7",
    title: "Account Management",
    description: "Help with account-related tasks and questions",
    scenarios: [
      "Password reset assistance",
      "Account upgrade discussion",
      "Account verification",
      "Profile update help"
    ],
    coverage: 10,
    performance: 15,
    tokens: 1500
  },
  {
    id: "8",
    title: "Feature Onboarding",
    description: "Guide customers through new features",
    scenarios: [
      "First-time user guidance",
      "Advanced feature tutorial",
      "Mobile app walkthrough",
      "Integration explanation"
    ],
    coverage: 22,
    performance: 28,
    tokens: 2100
  },
  {
    id: "9",
    title: "Complaint Handling",
    description: "Address and resolve customer complaints",
    scenarios: [
      "Service quality complaint",
      "Employee behavior complaint",
      "Long wait time complaint",
      "Repeated issues complaint"
    ],
    coverage: 30,
    performance: 35,
    tokens: 2300
  },
  {
    id: "10",
    title: "Cross-selling Opportunities",
    description: "Identify and present related products",
    scenarios: [
      "Complementary product suggestion",
      "Upgrade opportunity",
      "New service introduction",
      "Loyalty program enrollment"
    ],
    coverage: 28,
    performance: 33,
    tokens: 2200
  }
];

export const SimulationSteps = ({ 
  onComplete, 
  initialStatus = 'not-started', 
  coverage: initialCoverage, 
  performance: initialPerformance,
  scenarios: initialScenarios,
  simulations: initialSimulations
}: SimulationStepsProps) => {
  const [currentStep, setCurrentStep] = useState(initialStatus === 'not-started' ? 0 : initialStatus === 'in-progress' ? 1 : 2);
  const [recordings, setRecordings] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [selectedSimulations, setSelectedSimulations] = useState<string[]>([]);
  const [simulationCount, setSimulationCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [simulationsGenerated, setSimulationsGenerated] = useState(false);
  const [availableSimulations, setAvailableSimulations] = useState<Simulation[]>([]);

  useEffect(() => {
    if (initialScenarios && initialScenarios.length > 0) {
      const simulationIds = EXPANDED_SIMULATIONS
        .filter(sim => sim.scenarios.some(scenario => 
          initialScenarios.some(initScenario => 
            scenario.includes(initScenario.name)
          )
        ))
        .map(sim => sim.id);
      
      setSelectedSimulations(simulationIds);
    }
  }, [initialScenarios]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      ['audio/mpeg', 'audio/wav', 'audio/x-m4a'].includes(file.type)
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only MP3, WAV, or M4A files",
        variant: "destructive"
      });
    }
    
    setRecordings(prev => [...prev, ...validFiles]);
  };

  const removeRecording = (index: number) => {
    setRecordings(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSimulation = (id: string) => {
    setSelectedSimulations(prev => 
      prev.includes(id) 
        ? prev.filter(simId => simId !== id)
        : [...prev, id]
    );
  };

  const calculateTotals = () => {
    return availableSimulations
      .filter(sim => selectedSimulations.includes(sim.id))
      .reduce((acc, sim) => ({
        coverage: acc.coverage + sim.coverage,
        performance: acc.performance + sim.performance,
        tokens: acc.tokens + sim.tokens
      }), { coverage: 0, performance: 0, tokens: 0 });
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return recordings.length > 0 || description.trim().length > 0;
    }
    if (currentStep === 1) {
      return selectedSimulations.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 0) {
        // Transition to simulation selection - simulate generation
        setIsGenerating(true);
        startGenerationAnimation();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      onComplete({
        recordings,
        description,
        selectedSimulations,
        simulationCount
      });
    }
  };

  const startGenerationAnimation = () => {
    // Reset states
    setGenerationProgress(0);
    setCurrentInsight(0);
    
    // Progress animation
    let progress = 0;
    const insightInterval = setInterval(() => {
      setCurrentInsight(prev => {
        if (prev < SIMULATION_INSIGHTS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);
    
    const progressInterval = setInterval(() => {
      progress += 1;
      setGenerationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        clearInterval(insightInterval);
        
        setTimeout(() => {
          setIsGenerating(false);
          setSimulationsGenerated(true);
          setAvailableSimulations(EXPANDED_SIMULATIONS);
          setCurrentStep(prev => prev + 1);
        }, 500);
      }
    }, 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Upload Call Recordings</Label>
                <label className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/10 transition-colors">
                  <div className="text-center">
                    <FileAudio className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600">
                      <Button 
                        variant="outline"
                        className="relative px-6 py-5 font-semibold text-primary hover:text-primary/80"
                      >
                        <span>Upload files</span>
                        <Input
                          type="file"
                          className="sr-only"
                          accept=".mp3,.wav,.m4a"
                          multiple
                          onChange={handleFileUpload}
                        />
                      </Button>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600 mt-2">MP3, WAV, or M4A up to 10MB each</p>
                  </div>
                  <Input
                    type="file"
                    className="sr-only"
                    accept=".mp3,.wav,.m4a"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {recordings.length > 0 && (
                <div className="mt-4">
                  <Label>Uploaded Recordings</Label>
                  <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                    <div className="space-y-2">
                      {recordings.map((file, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileAudio className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecording(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="mt-4">
                <Label>Or Describe Your Customer Personas</Label>
                <Textarea
                  placeholder="Describe your typical customer interactions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  <p className="font-medium">Example:</p>
                  <p className="italic mt-1 text-xs">
                    "Our customers are primarily small business owners aged 30-50. They often call with urgent 
                    scheduling issues and have limited technical knowledge. Some common personas include: 
                    1) Busy professionals who are often multitasking during calls, 
                    2) Older customers who speak slowly and need patient assistance, 
                    3) Frustrated customers who've had previous negative experiences, and 
                    4) New customers who are unfamiliar with our services and need detailed explanations."
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        if (isGenerating) {
          return (
            <div className="space-y-8 py-4 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
                  <BrainCircuit className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-medium">Generating Your Simulations</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're analyzing your inputs to create the most effective simulation scenarios for your agent.
                </p>
              </div>
              
              <div className="max-w-md mx-auto space-y-6">
                <Progress value={generationProgress} className="h-2" />
                <div className="flex items-center px-4 py-3 rounded-lg border bg-card">
                  <div className="mr-4">
                    {currentInsight <= 2 ? (
                      <PenLine className="h-5 w-5 text-blue-500" />
                    ) : currentInsight <= 5 ? (
                      <Users2 className="h-5 w-5 text-violet-500" />
                    ) : currentInsight <= 8 ? (
                      <Bot className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">{SIMULATION_INSIGHTS[currentInsight]}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-card">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="text-sm">Analyzing industry context</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-card">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">Processing call recordings</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-card">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">Creating varied scenarios</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-card">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="text-sm">Optimizing token usage</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const totals = calculateTotals();
        return (
          <div className="space-y-4 animate-fade-in">
            {simulationsGenerated && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg p-4 mb-6 flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">Simulations Generated Successfully</p>
                  <p className="text-xs text-green-700 dark:text-green-500 mt-0.5">
                    {availableSimulations.length} simulations created based on your inputs
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Percent className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {totals.coverage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Coverage
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {totals.performance}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Performance
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {totals.tokens.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tokens
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {availableSimulations.map((sim) => (
                <Card
                  key={sim.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSimulations.includes(sim.id)
                      ? "border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleSimulation(sim.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{sim.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sim.description}
                        </p>
                      </div>
                      {selectedSimulations.includes(sim.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="mt-4">
                      <Label className="text-xs">Scenarios:</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {sim.scenarios.map((scenario, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {scenario}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Percent className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Coverage:</span>
                        <span className="font-medium">+{sim.coverage}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart className="h-3 w-3 text-purple-500" />
                        <span className="text-muted-foreground">Performance:</span>
                        <span className="font-medium">+{sim.performance}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span className="text-muted-foreground">Tokens:</span>
                        <span className="font-medium">{sim.tokens}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Label>Number of Simulations</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={simulationCount}
                  onChange={(e) => setSimulationCount(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  Recommended: 5 simulations ({totals.tokens.toLocaleString()} tokens)
                </span>
              </div>
            </div>
          </div>
        );

      case 2:
        const finalTotals = calculateTotals();
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Selected Simulations:</span>
                  <span>{selectedSimulations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Scenarios:</span>
                  <span>
                    {availableSimulations
                      .filter(sim => selectedSimulations.includes(sim.id))
                      .reduce((acc, sim) => acc + sim.scenarios.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Coverage:</span>
                  <span>{finalTotals.coverage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Performance Impact:</span>
                  <span>{finalTotals.performance}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Usage:</span>
                  <span>{finalTotals.tokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Simulation Count:</span>
                  <span>{simulationCount}</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        {STEPS.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center gap-2 ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step.icon}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>

      <Progress value={((currentStep + 1) / STEPS.length) * 100} />

      <div className="mt-8">{renderStepContent()}</div>

      <div className="flex justify-end gap-4 mt-6">
        {currentStep > 0 && !isGenerating && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isGenerating}
        >
          {isGenerating ? (
            <>
              <BrainCircuit className="mr-2 h-4 w-4 animate-spin" /> 
              Generating
            </>
          ) : currentStep === STEPS.length - 1 ? "Start Simulations" : "Continue"}
        </Button>
      </div>
    </div>
  );
};
