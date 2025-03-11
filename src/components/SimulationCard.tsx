
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationSteps } from "./SimulationSteps";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronUp } from "lucide-react";

interface SimulationCardProps {
  status?: 'not-started' | 'in-progress' | 'completed';
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
    tokens: string | number;
  }>;
  isActive?: boolean;
  onComplete?: () => void;
}

export const SimulationCard = ({
  status = 'not-started',
  coverage,
  performance,
  scenarios,
  simulations,
  isActive = false,
  onComplete
}: SimulationCardProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(status !== 'completed' || isActive);

  const handleSimulationComplete = (data: any) => {
    toast({
      title: "Starting Simulations",
      description: "Your simulations are being processed...",
    });
    console.log("Simulation data:", data);
    if (onComplete) onComplete();
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'not-started':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
            Not Started
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/30">
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getProgressValue = () => {
    switch (status) {
      case 'not-started':
        return 0;
      case 'in-progress':
        return 50;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressIndicatorColor = () => {
    switch (status) {
      case 'not-started':
        return "bg-gray-400 dark:bg-gray-600";
      case 'in-progress':
        return "bg-amber-500 dark:bg-amber-400";
      case 'completed':
        return "bg-green-500 dark:bg-green-400";
      default:
        return "bg-gray-400 dark:bg-gray-600";
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden mb-6 border ${
      isActive ? 'border-primary/50 shadow-md ring-2 ring-primary/30 bg-primary/5' : 'border-gray-200 dark:border-gray-800'
    } transition-all duration-300`}>
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center rounded-full w-8 h-8 text-gray-900 dark:text-white ${
              isActive ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              5
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Simulations</h3>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-2">
            {status !== 'not-started' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {status === 'completed' ? '100' : '50'}%
              </span>
            )}
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
          Generate and run scenarios to test your agent's performance
        </p>
        
        <Progress 
          value={getProgressValue()} 
          className="h-1.5 mb-6"
          indicatorColor={getProgressIndicatorColor()}
        />
        
        {isExpanded && (
          <CardContent className="p-0 pb-6">
            <SimulationSteps 
              onComplete={handleSimulationComplete}
              initialStatus={status}
              coverage={coverage}
              performance={performance}
              scenarios={scenarios}
              simulations={simulations}
              hideProgressBar={true}
            />
          </CardContent>
        )}
      </div>
    </div>
  );
};
