
import React, { useState } from "react";
import { AgentTrainingCard } from "./AgentTrainingCard";
import { WorkflowCard } from "./WorkflowCard";
import { SimulationCard } from "./SimulationCard";
import { Progress } from "@/components/ui/progress";

interface AgentSetupStepperProps {
  agent: any;
}

export const AgentSetupStepper: React.FC<AgentSetupStepperProps> = ({ agent }) => {
  const [steps, setSteps] = useState({
    training: { status: 'not-started' as const, active: true },
    workflow: { status: 'not-started' as const, active: false },
    simulation: { status: 'not-started' as const, active: false }
  });

  const totalSteps = Object.keys(steps).length;
  const completedSteps = Object.values(steps).filter(step => step.status === 'completed').length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  const handleStepComplete = (stepName: keyof typeof steps) => {
    setSteps(prevSteps => {
      const newSteps = { ...prevSteps };
      
      // Mark current step as completed
      newSteps[stepName].status = 'completed';
      newSteps[stepName].active = false;

      // Find next incomplete step
      const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;
      const currentIndex = stepKeys.indexOf(stepName);
      const nextStep = stepKeys[currentIndex + 1];

      if (nextStep) {
        newSteps[nextStep].status = 'in-progress';
        newSteps[nextStep].active = true;
      }

      return newSteps;
    });
  };

  const handleStepStart = (stepName: keyof typeof steps) => {
    setSteps(prevSteps => ({
      ...prevSteps,
      [stepName]: {
        ...prevSteps[stepName],
        status: 'in-progress'
      }
    }));
  };

  const sampleTrainingRecords = [
    {
      id: '1',
      title: 'Customer Support Call #1',
      date: 'Feb 20, 2024',
      time: '8:30 AM',
      duration: '5:30',
      type: 'call' as const
    },
    {
      id: '2',
      title: 'Role-Play Session #1',
      date: 'Feb 21, 2024',
      time: '3:15 PM',
      duration: '3:45',
      type: 'roleplay' as const
    }
  ];

  const sampleScenarios = [
    { id: "1", name: "Product Information Requests", completed: true },
    { id: "2", name: "Account Management", completed: true },
    { id: "3", name: "Billing Questions", completed: true },
    { id: "4", name: "Service Status Updates", completed: true }
  ];

  const sampleSimulations = [
    {
      id: "1",
      name: "Basic Customer Inquiries",
      date: "Feb 25, 2024",
      coverage: 52,
      performance: 68,
      scenarios: 4,
      tokens: "25.3k"
    },
    {
      id: "2",
      name: "Technical Support Basics",
      date: "Feb 24, 2024",
      coverage: 48,
      performance: 65,
      scenarios: 3,
      tokens: "18.6k"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Setup</h2>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2 text-gray-700 dark:text-gray-300">{overallProgress}% Complete</span>
            <Progress value={overallProgress} className="w-24 h-2" />
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          Complete these steps in order to fully configure your agent for optimal performance
        </p>
      </div>
      
      <div className="space-y-4 mt-8">
        {steps.training.status === 'not-started' && (
          <AgentTrainingCard 
            status="not-started" 
            stepNumber={1}
            isActive={steps.training.active}
            onStart={() => handleStepStart('training')}
            onComplete={() => handleStepComplete('training')}
          />
        )}
        
        {steps.training.status === 'in-progress' && (
          <AgentTrainingCard 
            status="in-progress"
            stepNumber={1}
            voiceSamples={3}
            voiceConfidence={65}
            talkTime="45s"
            trainingRecords={sampleTrainingRecords}
            isActive={steps.training.active}
            onComplete={() => handleStepComplete('training')}
          />
        )}
        
        {steps.training.status === 'completed' && (
          <AgentTrainingCard 
            status="completed"
            stepNumber={1}
            voiceSamples={10}
            totalSamples={10}
            voiceConfidence={95}
            talkTime="120s"
            trainingRecords={sampleTrainingRecords}
            isActive={steps.training.active}
          />
        )}

        {steps.workflow.status === 'not-started' && (
          <WorkflowCard 
            status="not-started"
            stepNumber={2}
            isActive={steps.workflow.active}
            onStart={() => handleStepStart('workflow')}
            onComplete={() => handleStepComplete('workflow')}
          />
        )}
        
        {steps.workflow.status === 'in-progress' && (
          <WorkflowCard 
            status="in-progress"
            stepNumber={2}
            isActive={steps.workflow.active}
            onComplete={() => handleStepComplete('workflow')}
          />
        )}
        
        {steps.workflow.status === 'completed' && (
          <WorkflowCard 
            status="completed"
            stepNumber={2}
            isActive={steps.workflow.active}
          />
        )}

        {steps.simulation.status === 'not-started' && (
          <SimulationCard 
            status="not-started"
            stepNumber={3}
            isActive={steps.simulation.active}
            onStart={() => handleStepStart('simulation')}
            onComplete={() => handleStepComplete('simulation')}
          />
        )}
        
        {steps.simulation.status === 'in-progress' && (
          <SimulationCard 
            status="in-progress"
            stepNumber={3}
            coverage={52}
            performance={68}
            scenarios={sampleScenarios}
            simulations={sampleSimulations}
            isActive={steps.simulation.active}
            onComplete={() => handleStepComplete('simulation')}
          />
        )}
        
        {steps.simulation.status === 'completed' && (
          <SimulationCard 
            status="completed"
            stepNumber={3}
            isActive={steps.simulation.active}
          />
        )}
      </div>
    </div>
  );
};
