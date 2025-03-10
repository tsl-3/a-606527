
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationSteps } from "./SimulationSteps";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Setup</CardTitle>
        <CardDescription>
          Generate personas and run simulations to test your agent's performance
        </CardDescription>
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
