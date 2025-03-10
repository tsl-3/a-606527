
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationSteps } from "./SimulationSteps";
import { useToast } from "@/hooks/use-toast";

export const SimulationCard = () => {
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
        <SimulationSteps onComplete={handleSimulationComplete} />
      </CardContent>
    </Card>
  );
};
