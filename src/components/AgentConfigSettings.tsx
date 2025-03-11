import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Cpu, Zap, Shield, Gauge, Clock, BarChart, Activity, AlertTriangle } from "lucide-react";
import { AgentType } from "@/types/agent";

export interface AgentConfigSettingsProps {
  agent: AgentType;
  onAgentUpdate: (updatedAgent: AgentType) => void;
}

const AgentConfigSettings: React.FC<AgentConfigSettingsProps> = ({ agent, onAgentUpdate }) => {
  const handlePerformanceUpdate = (key: string, value: any) => {
    const updatedAgent = {
      ...agent,
      config: {
        ...agent.config,
        performance: {
          ...agent.config?.performance,
          [key]: value
        }
      }
    };
    onAgentUpdate(updatedAgent);
  };

  const handleSecurityUpdate = (key: string, value: any) => {
    const updatedAgent = {
      ...agent,
      config: {
        ...agent.config,
        security: {
          ...agent.config?.security,
          [key]: value
        }
      }
    };
    onAgentUpdate(updatedAgent);
  };

  const handleMonitoringUpdate = (key: string, value: any) => {
    const updatedAgent = {
      ...agent,
      config: {
        ...agent.config,
        monitoring: {
          ...agent.config?.monitoring,
          [key]: value
        }
      }
    };
    onAgentUpdate(updatedAgent);
  };

  const handleResetToDefault = (section: 'performance' | 'security' | 'monitoring') => {
    const defaultConfigs = {
      performance: {
        responseSpeed: 'fast',
        streamingEnabled: true,
        memoryAllocation: 'standard',
        cachingEnabled: true
      },
      security: {
        contentFiltering: 'medium',
        piiDetection: true
      },
      monitoring: {
        analyticsLevel: 'advanced',
        healthMonitoring: true
      }
    };

    const updatedAgent = {
      ...agent,
      config: {
        ...agent.config,
        [section]: defaultConfigs[section]
      }
    };
    onAgentUpdate(updatedAgent);
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Agent Configuration</CardTitle>
        <CardDescription>Advanced settings for agent behavior and performance</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Response Speed</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 border-green-200"
                    onClick={() => handlePerformanceUpdate('responseSpeed', 
                      agent.config?.performance?.responseSpeed === 'fast' ? 'standard' : 'fast'
                    )}
                  >
                    {agent.config?.performance?.responseSpeed || 'Fast'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimize for faster agent response times
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Streaming Responses</span>
                  </div>
                  <Switch 
                    checked={agent.config?.performance?.streamingEnabled ?? true}
                    onCheckedChange={(checked) => handlePerformanceUpdate('streamingEnabled', checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Show responses as they're being generated
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Memory Allocation</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700 border-blue-200"
                    onClick={() => handlePerformanceUpdate('memoryAllocation',
                      agent.config?.performance?.memoryAllocation === 'high' ? 'standard' : 'high'
                    )}
                  >
                    {agent.config?.performance?.memoryAllocation || 'Standard'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Amount of context history retained between interactions
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Caching</span>
                  </div>
                  <Switch 
                    checked={agent.config?.performance?.cachingEnabled ?? true}
                    onCheckedChange={(checked) => handlePerformanceUpdate('cachingEnabled', checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Cache frequent responses for faster interactions
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => handleResetToDefault('performance')}
              >
                Reset to Default
              </Button>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Content Filtering</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700 border-blue-200"
                    onClick={() => handleSecurityUpdate('contentFiltering',
                      agent.config?.security?.contentFiltering === 'high' ? 'medium' : 'high'
                    )}
                  >
                    {agent.config?.security?.contentFiltering || 'Medium'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Filter level for harmful or inappropriate content
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">PII Detection</span>
                  </div>
                  <Switch 
                    checked={agent.config?.security?.piiDetection ?? true}
                    onCheckedChange={(checked) => handleSecurityUpdate('piiDetection', checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Detect and redact personally identifiable information
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => handleResetToDefault('security')}
              >
                Reset to Default
              </Button>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Analytics Level</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-purple-50 text-purple-700 border-purple-200"
                    onClick={() => handleMonitoringUpdate('analyticsLevel',
                      agent.config?.monitoring?.analyticsLevel === 'basic' ? 'advanced' : 'basic'
                    )}
                  >
                    {agent.config?.monitoring?.analyticsLevel || 'Advanced'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Detail level of usage analytics collected
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-agent-primary" />
                    <span className="text-sm font-medium">Health Monitoring</span>
                  </div>
                  <Switch 
                    checked={agent.config?.monitoring?.healthMonitoring ?? true}
                    onCheckedChange={(checked) => handleMonitoringUpdate('healthMonitoring', checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Monitor agent health and performance metrics
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => handleResetToDefault('monitoring')}
              >
                Reset to Default
              </Button>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentConfigSettings;
