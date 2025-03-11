
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationSteps } from "./SimulationSteps";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CircleDashed, CheckCircle, PlayCircle } from "lucide-react";

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
    tokens: string;
  }>;
}

export const SimulationCard = ({
  status = 'not-started',
  coverage,
  performance,
  scenarios,
  simulations
}: SimulationCardProps) => {
  const { toast } = useToast();

  const handleSimulationComplete = (data: any) => {
    toast({
      title: "Starting Simulations",
      description: "Your simulations are being processed...",
    });
    console.log("Simulation data:", data);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'not-started':
        return (
          <Badge variant="outline" className="gap-1 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
            <CircleDashed className="h-3.5 w-3.5" />
            <span>Not Started</span>
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30">
            <PlayCircle className="h-3.5 w-3.5" />
            <span>In Progress</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="gap-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Completed</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Simulation Setup</CardTitle>
          <CardDescription>
            Generate and run scenarios to test your agent's performance
          </CardDescription>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <SimulationSteps 
          onComplete={handleSimulationComplete}
          initialStatus={status}
          coverage={coverage}
          performance={performance}
          scenarios={scenarios}
          simulations={simulations}
        />
      </CardContent>
    </Card>
  );
};
