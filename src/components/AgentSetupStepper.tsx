import React, { useState, useRef } from "react";
import { 
  BookOpen, Workflow, FlaskConical, CheckCircle2, 
  Upload, PlayCircle, Bot, File, CircleDashed, ArrowRight,
  Clock, BarChart, ChevronUp, Download, Trash2, User, Mic,
  Users, UserRound, MessageCircle, Brain, Search, Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AgentChannels } from "./AgentChannels";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { PersonasCard } from "./PersonasCard";
import { WorkflowCard } from "./WorkflowCard";
import { SimulationCard } from "./SimulationCard";
import { RolePlayDialog } from "./RolePlayDialog";

interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
}

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  format?: string;
}

interface Persona {
  id: string;
  name: string;
  role: string;
  age: string;
  description: string;
  pain_points: string[];
  goals: string[];
}

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  progress?: number;
  children?: React.ReactNode;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ 
  title, 
  description, 
  icon, 
  isActive, 
  isCompleted, 
  progress = 0,
  children,
  stepNumber
}) => {
  return (
    <Card className={`mb-6 ${isActive ? 'border-primary/50 shadow-md' : 'border-gray-100 dark:border-gray-800'}`}>
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className={`p-2 rounded-full flex items-center justify-center ${
          isCompleted 
            ? 'bg-green-100 dark:bg-green-900/20' 
            : isActive 
              ? 'bg-primary/10' 
              : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <div className="h-5 w-5 flex items-center justify-center text-gray-900 dark:text-white">
              {stepNumber}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
            {progress > 0 && progress < 100 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
            )}
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">{description}</CardDescription>
          {progress > 0 && (
            <Progress value={progress} className="h-1.5 mt-2" />
          )}
        </div>
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

interface AgentType {
  // Define the properties of AgentType here
}

interface AgentSetupStepperProps {
  agent: AgentType;
  onUpdate?: (updatedAgent: AgentType) => void;
}

export const AgentSetupStepper: React.FC<AgentSetupStepperProps> = ({ agent, onUpdate }) => {
  const steps = {
    knowledge: { completed: false, progress: 15, active: true },
    personas: { completed: false, progress: 0, active: false },
    training: { completed: false, progress: 30, active: false },
    workflow: { completed: false, progress: 0, active: false },
    simulation: { completed: false, progress: 0, active: false }
  };
  
  const totalSteps = Object.keys(steps).length;
  const completedSteps = Object.values(steps).filter(step => step.completed).length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  const sampleTrainingRecords: TrainingRecord[] = [
    {
      id: '1',
      title: 'Customer Support Call #1',
      date: 'Feb 20, 2024',
      time: '8:30 AM',
      duration: '5:30',
      type: 'call'
    },
    {
      id: '2',
      title: 'Role-Play Session #1',
      date: 'Feb 21, 2024',
      time: '3:15 PM',
      duration: '3:45',
      type: 'roleplay'
    }
  ];

  const sampleDocuments: Document[] = [
    {
      id: '1',
      title: 'Company Guidelines.pdf',
      type: 'pdf',
      format: 'PDF',
      size: '2.5 MB',
      date: '2024-02-20'
    },
    {
      id: '2',
      title: 'Product Manual.docx',
      type: 'docx',
      format: 'DOCX',
      size: '1.8 MB',
      date: '2024-02-19'
    }
  ];

  const samplePersonas: Persona[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      age: '32',
      description: "Sarah is a busy marketing manager at a mid-sized tech company. She needs to stay on top of industry trends while managing her team and multiple campaigns.",
      pain_points: ['Time management', 'Information overload', 'Reporting'],
      goals: ['Increase ROI', 'Streamline workflows', 'Develop team']
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Software Developer',
      age: '28',
      description: "Michael is a full-stack developer who works remotely. He values technical documentation and efficient problem-solving approaches.",
      pain_points: ['Legacy code', 'Unclear requirements', 'Technical debt'],
      goals: ['Write clean code', 'Learn new technologies', 'Build scalable systems']
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      role: 'Customer Support Lead',
      age: '35',
      description: "Emma manages a team of support representatives. She's focused on improving customer satisfaction and reducing resolution times.",
      pain_points: ['High ticket volume', 'Training new staff', 'Complex issues'],
      goals: ['Improve CSAT scores', 'Reduce response time', 'Develop knowledge base']
    },
    {
      id: '4',
      name: 'David Washington',
      role: 'Finance Director',
      age: '45',
      description: "David oversees financial operations and needs accurate data for forecasting and reporting to stakeholders.",
      pain_points: ['Data accuracy', 'Manual processes', 'Compliance'],
      goals: ['Automate reporting', 'Improve forecasting', 'Reduce costs']
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
        <KnowledgeBaseCard 
          status="not-started" 
        />
        
        <KnowledgeBaseCard 
          status="in-progress" 
          documents={sampleDocuments}
          processedCount={2}
          totalCount={10}
        />
        
        <KnowledgeBaseCard 
          status="completed" 
          documents={[...sampleDocuments, 
            {
              id: '3',
              title: 'FAQ Documentation.pdf',
              type: 'pdf',
              format: 'PDF',
              size: '4.2 MB',
              date: '2024-02-22'
            },
            {
              id: '4',
              title: 'Training Materials.pptx',
              type: 'pptx',
              format: 'PPTX',
              size: '8.5 MB',
              date: '2024-02-23'
            }
          ]}
          processedCount={10}
          totalCount={10}
        />

        <PersonasCard 
          status="not-started" 
        />
        
        <PersonasCard 
          status="in-progress" 
          personas={samplePersonas}
          generatedCount={4}
          totalCount={10}
        />
        
        <PersonasCard 
          status="completed" 
          personas={[...samplePersonas, 
            {
              id: '5',
              name: 'Jennifer Lee',
              role: 'Product Manager',
              age: '36',
              description: "Jennifer oversees product development and works closely with engineering and design teams to deliver solutions that meet customer needs.",
              pain_points: ['Feature prioritization', 'Stakeholder management', 'Market fit'],
              goals: ['Increase user adoption', 'Improve retention', 'Drive innovation']
            },
            {
              id: '6',
              name: 'Robert Taylor',
              role: 'Sales Director',
              age: '42',
              description: "Robert leads the sales team and is focused on expanding the customer base while maintaining strong relationships with existing clients.",
              pain_points: ['Long sales cycles', 'Competitive market', 'CRM management'],
              goals: ['Exceed quota', 'Expand territories', 'Improve forecasting']
            },
            {
              id: '7',
              name: 'Lisa Morgan',
              role: 'HR Specialist',
              age: '39',
              description: "Lisa handles employee relations, recruitment, and policy implementation across the organization.",
              pain_points: ['Talent retention', 'Policy compliance', 'Employee engagement'],
              goals: ['Streamline hiring', 'Improve culture', 'Reduce turnover']
            },
            {
              id: '8',
              name: 'James Wilson',
              role: 'Operations Manager',
              age: '47',
              description: "James ensures business processes run efficiently and is always looking for ways to improve operational effectiveness.",
              pain_points: ['Process bottlenecks', 'Resource allocation', 'Quality control'],
              goals: ['Optimize processes', 'Reduce costs', 'Improve scalability']
            },
            {
              id: '9',
              name: 'Sophia Garcia',
              role: 'UX Designer',
              age: '31',
              description: "Sophia creates user-centered designs and conducts research to ensure products meet user needs and expectations.",
              pain_points: ['Usability testing', 'Design constraints', 'Developer handoff'],
              goals: ['Improve usability', 'Create design systems', 'User advocacy']
            },
            {
              id: '10',
              name: 'Thomas Brown',
              role: 'IT Administrator',
              age: '38',
              description: "Thomas manages the IT infrastructure and ensures systems are secure, up-to-date, and functioning properly.",
              pain_points: ['Security threats', 'Legacy systems', 'User support'],
              goals: ['Enhance security', 'System reliability', 'Automate maintenance']
            }
          ]}
          generatedCount={10}
          totalCount={10}
        />
      
        <AgentTrainingCard status="not-started" />
        
        <AgentTrainingCard 
          status="in-progress" 
          voiceSamples={3} 
          voiceConfidence={65} 
          talkTime="45s" 
          trainingRecords={sampleTrainingRecords}
        />
        
        <AgentTrainingCard 
          status="completed" 
          voiceSamples={10} 
          totalSamples={10}
          voiceConfidence={95} 
          talkTime="120s" 
          trainingRecords={sampleTrainingRecords}
        />
        
        <WorkflowCard 
          status="not-started" 
          stepNumber={4}
        />
        
        <WorkflowCard 
          status="in-progress"
          stepNumber={4}
        />
        
        <WorkflowCard 
          status="completed"
          stepNumber={4}
        />
        
        <SimulationCard 
          status="not-started" 
        />
        
        <SimulationCard 
          status="in-progress"
          coverage={52}
          performance={68}
          scenarios={sampleScenarios}
          simulations={sampleSimulations}
        />
        
        <SimulationCard 
          status="completed"
        />
      </div>
    </div>
  );
};
