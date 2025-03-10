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
import { Upload, Play, Check, FileAudio, X, ChevronRight, Users, Target, PlayCircle } from 'lucide-react';

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

const SAMPLE_SIMULATIONS: Simulation[] = [
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

  useEffect(() => {
    if (initialScenarios && initialScenarios.length > 0) {
      const simulationIds = SAMPLE_SIMULATIONS
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
    return SAMPLE_SIMULATIONS
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
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete({
        recordings,
        description,
        selectedSimulations,
        simulationCount
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Upload Call Recordings</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                  <div className="text-center">
                    <FileAudio className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80">
                        <span>Upload files</span>
                        <Input
                          type="file"
                          className="sr-only"
                          accept=".mp3,.wav,.m4a"
                          multiple
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">MP3, WAV, or M4A up to 10MB each</p>
                  </div>
                </div>
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
        const totals = calculateTotals();
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
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
                    <div className="text-2xl font-bold text-primary">
                      {totals.performance}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Performance
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {SAMPLE_SIMULATIONS.map((sim) => (
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
                  Recommended: 5 simulations ({totals.tokens} tokens)
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
                    {SAMPLE_SIMULATIONS
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
                  <span>{finalTotals.tokens}</span>
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
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === STEPS.length - 1 ? "Start Simulations" : "Continue"}
        </Button>
      </div>
    </div>
  );
};
