import React, { useState } from "react";
import { 
  FlaskConical, Target, TrendingUp, Check, PlayCircle, 
  SkipForward, List, ArrowRight, Plus, CircleCheck,
  CheckCircle2, ChevronUp, Download, Rocket, FileText, Mic, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch, SwitchWithLabels } from "@/components/ui/switch";

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
  const [isRecording, setIsRecording] = useState(false);

  const isCoverageComplete = coverage >= 95;
  const isPerformanceComplete = performance >= 90;
  const isComplete = isCoverageComplete && isPerformanceComplete;

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
            {status === 'not-started' && (
              <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
                <div className="text-center mb-8">
                  <FlaskConical className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Define Your User Personas</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Before running simulations, let's understand your target users. You can either describe them or record your explanation.
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
                      <Mic className="h-5 w-5 text-indigo-500" />
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">Voice Recording</h5>
                    </div>
                    <div className="flex flex-col items-center justify-center h-32 mb-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className={`h-12 w-12 rounded-full ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        <Mic className="h-6 w-6" />
                      </Button>
                      <span className="text-sm text-gray-500 mt-2">
                        {isRecording ? 'Recording...' : 'Click to Record'}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full gap-2" disabled={!isRecording}>
                      <Save className="h-4 w-4" />
                      Save Recording
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Simulation
                  </Button>
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-500" disabled>
                    <Rocket className="h-4 w-4" />
                    Generate Recommended Simulations
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
