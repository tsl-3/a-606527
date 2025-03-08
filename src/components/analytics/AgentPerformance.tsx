
import React from "react";
import { AgentType } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { CircleUser, PhoneOutgoing, PhoneIncoming } from "lucide-react";
import { AgentStats } from "@/components/AgentStats";

// Demo data for charts
const avmScoreData = [
  { date: "Mon", score: 7.2 },
  { date: "Tue", score: 7.5 },
  { date: "Wed", score: 7.8 },
  { date: "Thu", score: 7.4 },
  { date: "Fri", score: 7.9 },
  { date: "Sat", score: 8.2 },
  { date: "Sun", score: 8.0 },
];

const interactionData = [
  { date: "Mon", voice: 42, chat: 35, email: 21, social: 12 },
  { date: "Tue", voice: 38, chat: 42, email: 18, social: 15 },
  { date: "Wed", voice: 45, chat: 38, email: 25, social: 14 },
  { date: "Thu", voice: 39, chat: 36, email: 20, social: 11 },
  { date: "Fri", voice: 41, chat: 40, email: 22, social: 13 },
  { date: "Sat", voice: 30, chat: 28, email: 15, social: 8 },
  { date: "Sun", voice: 28, chat: 30, email: 17, social: 9 },
];

const callVolumeData = [
  { date: "Mon", inbound: 28, outbound: 14 },
  { date: "Tue", inbound: 25, outbound: 13 },
  { date: "Wed", inbound: 30, outbound: 15 },
  { date: "Thu", inbound: 26, outbound: 13 },
  { date: "Fri", inbound: 27, outbound: 14 },
  { date: "Sat", inbound: 19, outbound: 11 },
  { date: "Sun", inbound: 18, outbound: 10 },
];

const channelDistributionData = [
  { name: "Voice", value: 40 },
  { name: "Chat", value: 30 },
  { name: "Email", value: 20 },
  { name: "Social", value: 10 },
];

const callTypeDistributionData = [
  { name: "VoIP", value: 55 },
  { name: "Mobile", value: 30 },
  { name: "Landline", value: 15 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];

interface AgentPerformanceProps {
  agent: AgentType;
}

export const AgentPerformance: React.FC<AgentPerformanceProps> = ({ agent }) => {
  return (
    <div className="space-y-4">
      {/* AVM Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">AVM Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-col items-center justify-center h-32">
                <div className="text-5xl font-bold text-primary">
                  {agent.avmScore?.toFixed(1) || "7.8"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">out of 10</div>
                <Badge variant="outline" className="mt-2">
                  Excellent
                </Badge>
              </div>
              
              <div className="pt-3">
                <AgentStats 
                  avmScore={agent.avmScore || 7.8} 
                  interactionCount={agent.interactions || 1245}
                  csat={agent.csat}
                  performance={agent.performance}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">AVM Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList className="mb-2">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avmScoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[6, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="weekly" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avmScoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[6, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="monthly" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avmScoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[6, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Interactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Interactions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={interactionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="voice" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  <Area type="monotone" dataKey="chat" stackId="1" stroke="#D946EF" fill="#D946EF" />
                  <Area type="monotone" dataKey="email" stackId="1" stroke="#F97316" fill="#F97316" />
                  <Area type="monotone" dataKey="social" stackId="1" stroke="#0EA5E9" fill="#0EA5E9" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Interactions by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {channelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Call Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <PhoneIncoming className="h-5 w-5 text-primary mb-1" />
                  <div className="text-2xl font-bold">65%</div>
                  <div className="text-xs text-muted-foreground">Inbound</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <PhoneOutgoing className="h-5 w-5 text-primary mb-1" />
                  <div className="text-2xl font-bold">35%</div>
                  <div className="text-xs text-muted-foreground">Outbound</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                <CircleUser className="h-5 w-5 text-primary mb-1" />
                <div className="text-2xl font-bold">512</div>
                <div className="text-xs text-muted-foreground">Total Voice Interactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Call Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={callVolumeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inbound" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="outbound" stackId="a" fill="#D946EF" />
                  <Line type="monotone" dataKey="inbound" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="outbound" stroke="#D946EF" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Call Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={callTypeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {callTypeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
