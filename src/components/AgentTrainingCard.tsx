
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Upload, PlayCircle, StopCircle, Clock, VolumeX, Volume2 } from "lucide-react";

export interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
}

export interface AgentTrainingCardProps {
  status: 'not-started' | 'in-progress' | 'completed';
  stepNumber?: number;
  voiceSamples?: number;
  totalSamples?: number;
  voiceConfidence?: number;
  talkTime?: string;
  trainingRecords?: TrainingRecord[];
}

export const AgentTrainingCard: React.FC<AgentTrainingCardProps> = ({
  status = 'not-started',
  stepNumber = 3,
  voiceSamples = 0,
  totalSamples = 10,
  voiceConfidence = 0,
  talkTime = '0s',
  trainingRecords = []
}) => {
  const progress = status === 'completed' ? 100 : status === 'in-progress' ? Math.round((voiceSamples / (totalSamples || 10)) * 100) : 0;
  
  return (
    <Card className={`mb-6 ${status === 'in-progress' ? 'border-primary/50 shadow-md' : 'border-gray-100 dark:border-gray-800'}`}>
      <CardHeader className="flex flex-row items-start gap-4 pb-2">
        <div className={`p-2 rounded-full flex items-center justify-center ${
          status === 'completed' 
            ? 'bg-green-100 dark:bg-green-900/20' 
            : status === 'in-progress' 
              ? 'bg-primary/10' 
              : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {status === 'completed' ? (
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="white"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="h-5 w-5 flex items-center justify-center text-gray-900 dark:text-white">
              {stepNumber}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Voice Training</CardTitle>
            {status !== 'not-started' && (
              <Badge variant={status === 'completed' ? 'outline' : 'secondary'} className={status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                {status === 'completed' ? 'Completed' : `${progress}%`}
              </Badge>
            )}
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Train your agent with voice samples and real-time interactions
          </CardDescription>
          {status === 'in-progress' && (
            <Progress value={progress} className="h-1.5 mt-2" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {status === 'not-started' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Your agent needs voice training to sound natural and respond effectively to voice interactions.
            </p>
            <div className="flex flex-col gap-3">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Voice Samples</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Record Voice Sample</span>
              </Button>
            </div>
          </div>
        )}
        
        {status === 'in-progress' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-xs text-muted-foreground">Voice Samples</span>
                  </div>
                  <span className="text-sm font-medium">{voiceSamples}/{totalSamples}</span>
                </div>
                <Progress value={(voiceSamples / (totalSamples || 10)) * 100} className="h-1.5" />
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-xs text-muted-foreground">Voice Confidence</span>
                  </div>
                  <span className="text-sm font-medium">{voiceConfidence}%</span>
                </div>
                <Progress value={voiceConfidence} className="h-1.5" />
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-xs text-muted-foreground">Talk Time</span>
                  </div>
                </div>
                <div className="flex items-center justify-center h-5">
                  <span className="text-xl font-semibold">{talkTime}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary/30 p-2 border-b">
                <h3 className="text-sm font-medium">Training Records</h3>
              </div>
              <div className="divide-y">
                {trainingRecords.map(record => (
                  <div key={record.id} className="p-3 flex items-center justify-between hover:bg-secondary/20">
                    <div className="flex items-center gap-3">
                      {record.type === 'call' ? (
                        <Avatar className="h-8 w-8 bg-blue-100">
                          <AvatarFallback className="text-blue-500">
                            <Volume2 className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 bg-purple-100">
                          <AvatarFallback className="text-purple-500">
                            <Mic className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm font-medium">{record.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span>{record.time}</span>
                          <span>•</span>
                          <span>{record.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {trainingRecords.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No training records yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload More Voice Samples</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Record Voice Sample</span>
              </Button>
            </div>
          </div>
        )}
        
        {status === 'completed' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-xs text-muted-foreground">Voice Samples</span>
                  </div>
                  <span className="text-sm font-medium">{voiceSamples}/{totalSamples}</span>
                </div>
                <Progress value={100} className="h-1.5 bg-green-100" />
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-xs text-muted-foreground">Voice Confidence</span>
                  </div>
                  <span className="text-sm font-medium">{voiceConfidence}%</span>
                </div>
                <Progress value={voiceConfidence} className="h-1.5" />
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-agent-primary" />
                    <span className="text-xs text-muted-foreground">Talk Time</span>
                  </div>
                </div>
                <div className="flex items-center justify-center h-5">
                  <span className="text-xl font-semibold">{talkTime}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary/30 p-2 border-b">
                <h3 className="text-sm font-medium">Training Records</h3>
              </div>
              <div className="divide-y">
                {trainingRecords.map(record => (
                  <div key={record.id} className="p-3 flex items-center justify-between hover:bg-secondary/20">
                    <div className="flex items-center gap-3">
                      {record.type === 'call' ? (
                        <Avatar className="h-8 w-8 bg-blue-100">
                          <AvatarFallback className="text-blue-500">
                            <Volume2 className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 bg-purple-100">
                          <AvatarFallback className="text-purple-500">
                            <Mic className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm font-medium">{record.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span>{record.time}</span>
                          <span>•</span>
                          <span>{record.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Fine-tune Voice</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
