
import React from "react";
import { AgentType } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, Info } from "lucide-react";

// Demo data for charts
const topicDistributionData = [
  { topic: "Issue Resolution", percentage: 35 },
  { topic: "Billing Questions", percentage: 25 },
  { topic: "Technical Support", percentage: 20 },
  { topic: "General Inquiry", percentage: 15 },
  { topic: "Other", percentage: 5 },
];

const topicTrendData = [
  { date: "Jan", "Issue Resolution": 30, "Billing Questions": 20, "Technical Support": 25, "General Inquiry": 10, "Other": 5 },
  { date: "Feb", "Issue Resolution": 32, "Billing Questions": 22, "Technical Support": 23, "General Inquiry": 12, "Other": 5 },
  { date: "Mar", "Issue Resolution": 33, "Billing Questions": 24, "Technical Support": 22, "General Inquiry": 13, "Other": 6 },
  { date: "Apr", "Issue Resolution": 34, "Billing Questions": 25, "Technical Support": 21, "General Inquiry": 14, "Other": 6 },
  { date: "May", "Issue Resolution": 35, "Billing Questions": 25, "Technical Support": 20, "General Inquiry": 15, "Other": 5 },
  { date: "Jun", "Issue Resolution": 36, "Billing Questions": 24, "Technical Support": 20, "General Inquiry": 15, "Other": 5 },
];

const wordCloudData = [
  { text: "Account", value: 85, sentiment: "positive" },
  { text: "Billing", value: 72, sentiment: "neutral" },
  { text: "Payment", value: 64, sentiment: "positive" },
  { text: "Error", value: 56, sentiment: "negative" },
  { text: "Support", value: 52, sentiment: "positive" },
  { text: "Update", value: 48, sentiment: "neutral" },
  { text: "Password", value: 45, sentiment: "neutral" },
  { text: "Issue", value: 42, sentiment: "negative" },
  { text: "Help", value: 40, sentiment: "neutral" },
  { text: "Cancel", value: 38, sentiment: "negative" },
  { text: "Subscription", value: 35, sentiment: "neutral" },
  { text: "Thanks", value: 32, sentiment: "positive" },
  { text: "Login", value: 30, sentiment: "neutral" },
  { text: "Service", value: 28, sentiment: "positive" },
  { text: "Upgrade", value: 25, sentiment: "positive" },
];

interface TopicInsightsProps {
  agent: AgentType;
}

export const TopicInsights: React.FC<TopicInsightsProps> = ({ agent }) => {
  const getRandomSize = (baseSize: number) => {
    return baseSize * (0.8 + Math.random() * 0.6);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 dark:text-green-400";
      case "negative":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* Word Cloud / Heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Common Words & Phrases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center p-4 gap-2 min-h-64">
            {wordCloudData.map((word, index) => (
              <div 
                key={index} 
                className={`inline-block p-2 rounded-md hover:bg-muted transition-colors cursor-help ${getSentimentColor(word.sentiment)}`}
                style={{ 
                  fontSize: `${getRandomSize(word.value / 7)}px`,
                  fontWeight: word.value > 50 ? 'bold' : 'normal'
                }}
                title={`${word.text}: Used ${word.value} times (${word.sentiment} sentiment)`}
              >
                {word.text}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground gap-2">
            <Info className="h-3 w-3" />
            <span>Hover over words to see usage details</span>
          </div>
        </CardContent>
      </Card>

      {/* Topic Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Top Conversation Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicDistributionData.map((topic, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">{topic.topic}</span>
                  </div>
                  <Badge variant="outline">{topic.percentage}%</Badge>
                </div>
                <Progress value={topic.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topics Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Topic Distribution Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Issue Resolution" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="Billing Questions" stackId="a" fill="#D946EF" />
                <Bar dataKey="Technical Support" stackId="a" fill="#F97316" />
                <Bar dataKey="General Inquiry" stackId="a" fill="#0EA5E9" />
                <Bar dataKey="Other" stackId="a" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
