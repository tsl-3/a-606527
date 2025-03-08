
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AgentPerformance } from "@/components/analytics/AgentPerformance";
import { TestingCoverage } from "@/components/analytics/TestingCoverage";
import { SentimentAnalysis } from "@/components/analytics/SentimentAnalysis";
import { TopicInsights } from "@/components/analytics/TopicInsights";
import { ChannelBreakdown } from "@/components/analytics/ChannelBreakdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const AgentAnalytics = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { agent, isLoading, error } = useAgentDetails(agentId);
  const [activeTab, setActiveTab] = useState("performance");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-agent-primary animate-spin" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <h2 className="text-2xl font-semibold text-foreground dark:text-white">
          Error Loading Agent Analytics
        </h2>
        <p className="text-muted-foreground dark:text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-foreground dark:text-white tracking-tight">
          Analytics: {agent.name}
        </h1>
        <p className="text-muted-foreground dark:text-gray-300 mt-1">
          Performance metrics and insights for your agent
        </p>
      </div>

      {/* Global filters and KPI cards */}
      <AnalyticsHeader agent={agent} />

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <AgentPerformance agent={agent} />
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <TestingCoverage agent={agent} />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <SentimentAnalysis agent={agent} />
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <TopicInsights agent={agent} />
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <ChannelBreakdown agent={agent} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentAnalytics;
