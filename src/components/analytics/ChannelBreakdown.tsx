
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
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Mail, Share2 } from "lucide-react";
import { SwitchWithLabels } from "@/components/ui/switch";

// Demo data
const channelDistributionData = [
  { name: "Voice", value: 40, icon: <Phone className="h-4 w-4" /> },
  { name: "Chat", value: 30, icon: <MessageSquare className="h-4 w-4" /> },
  { name: "Email", value: 20, icon: <Mail className="h-4 w-4" /> },
  { name: "Social", value: 10, icon: <Share2 className="h-4 w-4" /> },
];

const channelPerformanceData = [
  { channel: "Voice", responseTime: 75, successRate: 92, sentiment: 85 },
  { channel: "Chat", responseTime: 90, successRate: 88, sentiment: 80 },
  { channel: "Email", responseTime: 60, successRate: 95, sentiment: 75 },
  { channel: "Social", responseTime: 70, successRate: 82, sentiment: 70 },
];

const channelTrendData = [
  { month: "Jan", Voice: 35, Chat: 25, Email: 20, Social: 8 },
  { month: "Feb", Voice: 38, Chat: 28, Email: 18, Social: 9 },
  { month: "Mar", Voice: 40, Chat: 30, Email: 19, Social: 10 },
  { month: "Apr", Voice: 37, Chat: 32, Email: 20, Social: 12 },
  { month: "May", Voice: 40, Chat: 30, Email: 20, Social: 10 },
  { month: "Jun", Voice: 42, Chat: 28, Email: 21, Social: 9 },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];

interface ChannelBreakdownProps {
  agent: AgentType;
}

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({ agent }) => {
  const [showPercentages, setShowPercentages] = React.useState(true);

  return (
    <div className="space-y-4">
      {/* Channel Distribution Pie Chart */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Channel Distribution</CardTitle>
          <SwitchWithLabels 
            checked={showPercentages} 
            onCheckedChange={setShowPercentages}
            offLabel="Count"
            onLabel="Percentage"
          />
        </CardHeader>
        <CardContent>
          <div className="h-64">
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
                  label={({ name, percent, value }) => 
                    showPercentages 
                      ? `${name} ${(percent * 100).toFixed(0)}%` 
                      : `${name} (${value})`
                  }
                  labelLine={false}
                >
                  {channelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => showPercentages ? `${value}%` : value} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {channelDistributionData.map((channel, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, color: COLORS[index % COLORS.length] }}
              >
                {channel.icon}
                <span>{channel.name}</span>
                <span className="font-bold">{channel.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Channel Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={channelPerformanceData} 
                margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="channel" type="category" />
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
                <Bar dataKey="responseTime" name="Response Time Score" fill="#8B5CF6" />
                <Bar dataKey="successRate" name="Success Rate" fill="#D946EF" />
                <Bar dataKey="sentiment" name="Sentiment Score" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Channel Effectiveness Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Channel Effectiveness Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={channelTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Voice" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={{ fill: "#8B5CF6", r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Chat" 
                  stroke="#D946EF" 
                  strokeWidth={2} 
                  dot={{ fill: "#D946EF", r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Email" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                  dot={{ fill: "#F97316", r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Social" 
                  stroke="#0EA5E9" 
                  strokeWidth={2} 
                  dot={{ fill: "#0EA5E9", r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
