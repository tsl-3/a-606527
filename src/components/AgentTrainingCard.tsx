
import React from 'react';
import { BookOpen, Upload, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgentTrainingCardProps {
  title: string;
  description: string;
  icon: 'docs' | 'upload' | 'complete';
  status?: 'pending' | 'complete' | 'locked';
  onClick?: () => void;
}

const AgentTrainingCard: React.FC<AgentTrainingCardProps> = ({
  title,
  description,
  icon,
  status = 'pending',
  onClick
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'docs':
        return <BookOpen className="h-5 w-5 text-agent-primary" />;
      case 'upload':
        return <Upload className="h-5 w-5 text-agent-primary" />;
      case 'complete':
        return <CheckSquare className="h-5 w-5 text-green-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-agent-primary" />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'locked':
        return 'bg-gray-200 border-gray-300 opacity-60';
      default:
        return 'bg-white border-gray-200 hover:border-agent-primary/50 hover:shadow-md';
    }
  };

  return (
    <Card 
      className={`transition duration-200 ${getStatusClass()}`}
      onClick={status !== 'locked' ? onClick : undefined}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-md bg-agent-primary/10">
            {getIcon()}
          </div>
          {status === 'complete' && (
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              Complete
            </span>
          )}
          {status === 'locked' && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Locked
            </span>
          )}
        </div>
        <CardTitle className="text-md mt-3">{title}</CardTitle>
        <CardDescription className="text-xs mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        {status !== 'complete' && status !== 'locked' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-8 mt-2"
            onClick={onClick}
          >
            {status === 'pending' ? 'Start' : 'Continue'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentTrainingCard;
