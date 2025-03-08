
import React from "react";
import { AgentType } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Smile, Meh, Frown, TrendingUp, TrendingDown } from "lucide-react";

// Demo data for charts
const sentimentTrendData = [
  { date: "Jan", positive: 55, neutral: 30, negative: 15 },
  { date: "Feb", positive: 60, neutral: 25, negative: 15 },
  { date: "Mar", positive: 65, neutral: 25, negative: 10 },
  { date: "Apr", positive: 62, neutral: 28, negative: 10 },
  { date: "May", positive: 68, neutral: 22, negative: 10 },
  { date: "Jun", positive: 65, neutral: 24, negative: 11 },
];

const sentimentBreakdownData = [
  { name: "Positive", value: 65 },
  { name: "Neutral", value: 24 },
  { name: "Negative", value: 11 },
];

const COLORS = ["#10B981", "#94A3B8", "#F87171"];

interface SentimentAnalysisProps {
  agent: AgentType;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ agent }) => {
  const sentimentChange = 5.2; // For demo purposes, positive change in percentage
  
  return (
    <div className="space-y-4">
      {/* Sentiment Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <Smile className="h-8 w-8 text-green-500" />
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400">65%</h3>
              <p className="text-sm text-green-600 dark:text-green-500">Positive</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <Meh className="h-8 w-8 text-slate-500" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400">24%</h3>
              <p className="text-sm text-slate-600 dark:text-slate-500">Neutral</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <Frown className="h-8 w-8 text-red-500" />
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400">11%</h3>
              <p className="text-sm text-red-600 dark:text-red-500">Negative</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Change Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sentiment Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-3xl font-bold">
                {sentimentChange > 0 ? "+" : ""}{sentimentChange}%
              </p>
              <p className="text-sm text-muted-foreground">
                Change in positive sentiment over the last 30 days
              </p>
            </div>
            <div className={`p-4 rounded-full ${
              sentimentChange > 0
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {sentimentChange > 0 ? (
                <TrendingUp className="h-8 w-8" />
              ) : (
                <TrendingDown className="h-8 w-8" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Distribution Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sentimentBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sentiment Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" name="Positive" stackId="a" fill="#10B981" />
                <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#94A3B8" />
                <Bar dataKey="negative" name="Negative" stackId="a" fill="#F87171" />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#047857" 
                  strokeWidth={2} 
                  dot={{ fill: "#047857", r: 4 }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
