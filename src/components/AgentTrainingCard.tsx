
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Upload, User, Play, Clock } from "lucide-react";

interface TrainingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'call' | 'roleplay';
}

interface AgentTrainingCardProps {
  status: "not-started" | "in-progress" | "completed";
  voiceSamples?: number;
  totalSamples?: number;
  voiceConfidence?: number;
  talkTime?: string;
  trainingRecords?: TrainingRecord[];
  stepNumber?: number;
}

export const AgentTrainingCard: React.FC<AgentTrainingCardProps> = ({
  status,
  voiceSamples = 0,
  totalSamples = 10,
  voiceConfidence = 0,
  talkTime = "0s",
  trainingRecords = [],
  stepNumber = 3
}) => {
  switch (status) {
    case "not-started":
      return (
        <Card className="relative border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="p-2 mr-4 rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-5 w-5 flex items-center justify-center text-gray-900 dark:text-white">
                  {stepNumber}
                </div>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Voice Training</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Train your agent by uploading voice samples
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="flex justify-between flex-col md:flex-row gap-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload voice samples to train your agent's voice recognition capabilities.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <Mic className="h-3 w-3 mr-1" />
                    Voice Training
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Samples
                </Button>
                <Button>Get Started</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
      
    case "in-progress":
      return (
        <Card className="relative border-primary/50 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="p-2 mr-4 rounded-full bg-primary/10">
                <div className="h-5 w-5 flex items-center justify-center text-gray-900 dark:text-white">
                  {stepNumber}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Voice Training</CardTitle>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((voiceSamples / totalSamples) * 100)}%</span>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {voiceSamples} of {totalSamples} voice samples processed
                </CardDescription>
                <Progress value={(voiceSamples / totalSamples) * 100} className="h-1.5 mt-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-secondary/30 p-3 rounded-lg flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Mic className="h-4 w-4 text-agent-primary" />
                  <span className="text-xs text-muted-foreground">Voice Samples</span>
                </div>
                <span className="text-xl font-semibold">{voiceSamples}/{totalSamples}</span>
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-agent-primary" />
                  <span className="text-xs text-muted-foreground">Voice Confidence</span>
                </div>
                <span className="text-xl font-semibold">{voiceConfidence}%</span>
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-agent-primary" />
                  <span className="text-xs text-muted-foreground">Talk Time</span>
                </div>
                <span className="text-xl font-semibold">{talkTime}</span>
              </div>
            </div>
            
            {trainingRecords.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium">Recent Training Sessions</h4>
                <div className="space-y-2">
                  {trainingRecords.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {record.type === 'call' ? (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <Mic className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{record.title}</p>
                          <p className="text-xs text-muted-foreground">{record.date} • {record.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{record.duration}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1 md:flex-none">
                <Upload className="h-4 w-4 mr-2" />
                Add More Samples
              </Button>
              <Button>Continue</Button>
            </div>
          </CardContent>
        </Card>
      );
      
    case "completed":
      return (
        <Card className="relative border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="p-2 mr-4 rounded-full bg-green-100 dark:bg-green-900/20">
                <div className="h-5 w-5 flex items-center justify-center text-green-500">
                  ✓
                </div>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Voice Training</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Voice training complete
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-secondary/30 p-3 rounded-lg flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Mic className="h-4 w-4 text-agent-primary" />
                  <span className="text-xs text-muted-foreground">Voice Samples</span>
                </div>
                <span className="text-xl font-semibold">{voiceSamples}/{totalSamples}</span>
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-agent-primary" />
                  <span className="text-xs text-muted-foreground">Voice Confidence</span>
                </div>
                <span className="text-xl font-semibold">{voiceConfidence}%</span>
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-lg flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-agent-primary" />
                  <span className="text-xs text-muted-foreground">Talk Time</span>
                </div>
                <span className="text-xl font-semibold">{talkTime}</span>
              </div>
            </div>
            
            <Button variant="outline" className="mt-4">
              <Upload className="h-4 w-4 mr-2" />
              Update Voice Samples
            </Button>
          </CardContent>
        </Card>
      );
  }
};
