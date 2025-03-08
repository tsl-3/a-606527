
import React from "react";
import { AgentType } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// Demo data for charts
const testCaseExecutionData = [
  { date: "Jan", planned: 40, executed: 38 },
  { date: "Feb", planned: 45, executed: 42 },
  { date: "Mar", planned: 50, executed: 45 },
  { date: "Apr", planned: 55, executed: 48 },
  { date: "May", planned: 60, executed: 53 },
  { date: "Jun", planned: 65, executed: 58 },
];

const featureCoverageData = [
  { feature: "Authentication", coverage: 95 },
  { feature: "Navigation", coverage: 90 },
  { feature: "Content Display", coverage: 87 },
  { feature: "Form Handling", coverage: 83 },
  { feature: "Notifications", coverage: 78 },
  { feature: "Error Handling", coverage: 75 },
  { feature: "API Integration", coverage: 85 },
  { feature: "Performance", coverage: 70 },
];

interface TestingCoverageProps {
  agent: AgentType;
}

export const TestingCoverage: React.FC<TestingCoverageProps> = ({ agent }) => {
  const totalCoverage = 87; // For demo purposes

  const getStatusColor = (coverage: number) => {
    if (coverage >= 90) return "text-green-500 bg-green-50 dark:bg-green-900/20";
    if (coverage >= 75) return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
    return "text-red-500 bg-red-50 dark:bg-red-900/20";
  };

  const getStatusIcon = (coverage: number) => {
    if (coverage >= 90) return <CheckCircle2 className="h-4 w-4" />;
    if (coverage >= 75) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Overall Testing Coverage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Testing Coverage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-primary">{totalCoverage}%</div>
              <div className="text-sm text-muted-foreground mt-1">Overall Test Coverage</div>
              <Progress value={totalCoverage} className="w-full h-2 mt-4" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm font-medium">Total Test Cases</span>
                <Badge variant="outline">234</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm font-medium">Executed</span>
                <Badge variant="outline">204</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm font-medium">Pending</span>
                <Badge variant="outline">30</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm font-medium">Passed</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">196</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm font-medium">Failed</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">8</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="text-sm font-medium">Critical Issues</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">3</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Case Execution Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Test Case Execution Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testCaseExecutionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="planned" name="Planned Tests" fill="#8884d8" />
                <Bar dataKey="executed" name="Executed Tests" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Feature Coverage Heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Feature Coverage Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {featureCoverageData.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full ${getStatusColor(item.coverage)}`}>
                      {getStatusIcon(item.coverage)}
                    </span>
                    <span className="text-sm font-medium">{item.feature}</span>
                  </div>
                  <span className="text-sm font-medium">{item.coverage}%</span>
                </div>
                <Progress value={item.coverage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
