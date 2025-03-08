
import { useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useAgentDetails } from "@/hooks/useAgentDetails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentStats } from "@/components/AgentStats";
import { 
  ArrowDown, ArrowUp, BarChart2, CalendarIcon, LineChart, PieChart, 
  Users, Phone, MessageSquare, Mail, Smile, Clock, BarChart, Layers,
  CheckCircle, AlertCircle, Zap, MessageCircle, Hash, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, BarChart as ReBarChart, Bar, LineChart as ReLineChart, Line, 
  PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer
} from "recharts";

// Sample data for charts
const generateDateRange = (days: number) => {
  const result = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    result.push({
      date: format(date, 'MMM dd'),
      fullDate: date
    });
  }
  
  return result;
};

const last30Days = generateDateRange(30);

const avmScoreData = last30Days.map(({ date }) => ({
  date,
  score: Math.floor(Math.random() * 2) + 7 + (Math.random() * 2),
}));

const interactionsData = last30Days.map(({ date }) => ({
  date,
  voice: Math.floor(Math.random() * 30) + 20,
  chat: Math.floor(Math.random() * 25) + 15,
  email: Math.floor(Math.random() * 15) + 5,
  social: Math.floor(Math.random() * 10) + 3,
}));

const callsData = last30Days.map(({ date }) => ({
  date,
  inbound: Math.floor(Math.random() * 20) + 10,
  outbound: Math.floor(Math.random() * 15) + 5,
}));

const testingData = last30Days.map(({ date }) => ({
  date,
  completed: Math.floor(Math.random() * 30) + 60,
  inProgress: Math.floor(Math.random() * 15) + 5,
  failed: Math.floor(Math.random() * 10) + 2,
}));

const sentimentData = last30Days.map(({ date }) => ({
  date,
  positive: Math.floor(Math.random() * 30) + 50,
  neutral: Math.floor(Math.random() * 20) + 20,
  negative: Math.floor(Math.random() * 15) + 5,
}));

const channelDistributionData = [
  { name: 'Voice', value: 40, color: '#8B5CF6' },
  { name: 'Chat', value: 30, color: '#0EA5E9' },
  { name: 'Email', value: 20, color: '#F97316' },
  { name: 'Social', value: 10, color: '#D946EF' },
];

const callChannelData = [
  { name: 'VoIP', value: 45, color: '#8B5CF6' },
  { name: 'Mobile', value: 35, color: '#0EA5E9' },
  { name: 'Landline', value: 20, color: '#F97316' },
];

const sentimentDistributionData = [
  { name: 'Positive', value: 65, color: '#22C55E' },
  { name: 'Neutral', value: 25, color: '#F59E0B' },
  { name: 'Negative', value: 10, color: '#EF4444' },
];

const topTopicsData = [
  { name: 'Issue Resolution', value: 35, color: '#8B5CF6' },
  { name: 'Billing Questions', value: 25, color: '#0EA5E9' },
  { name: 'Technical Support', value: 20, color: '#F97316' },
  { name: 'General Inquiry', value: 15, color: '#D946EF' },
  { name: 'Other', value: 5, color: '#9CA3AF' },
];

const channelPerformanceData = [
  { name: 'Voice', responseTime: 92, successRate: 95, sentiment: 88 },
  { name: 'Chat', responseTime: 86, successRate: 90, sentiment: 82 },
  { name: 'Email', responseTime: 78, successRate: 88, sentiment: 75 },
  { name: 'Social', responseTime: 82, successRate: 85, sentiment: 80 },
];

const testFeatureCoverage = [
  { name: 'Authentication', coverage: 95 },
  { name: 'Billing', coverage: 88 },
  { name: 'Order Management', coverage: 92 },
  { name: 'Account Setup', coverage: 78 },
  { name: 'Password Reset', coverage: 96 },
  { name: 'Payment Processing', coverage: 85 },
  { name: 'User Profile', coverage: 90 },
  { name: 'Notifications', coverage: 82 },
  { name: 'Integrations', coverage: 75 },
  { name: 'Reporting', coverage: 80 },
];

// Random words for word cloud with random frequencies
const wordCloudData = [
  { text: 'Billing', value: 64 },
  { text: 'Account', value: 53 },
  { text: 'Payment', value: 42 },
  { text: 'Setup', value: 38 },
  { text: 'Password', value: 35 },
  { text: 'Reset', value: 31 },
  { text: 'Login', value: 28 },
  { text: 'Subscription', value: 26 },
  { text: 'Update', value: 24 },
  { text: 'Cancel', value: 22 },
  { text: 'Renew', value: 21 },
  { text: 'Problem', value: 20 },
  { text: 'Question', value: 19 },
  { text: 'Help', value: 18 },
  { text: 'Support', value: 17 },
  { text: 'Invoice', value: 16 },
  { text: 'Error', value: 15 },
  { text: 'Upgrade', value: 14 },
  { text: 'Downgrade', value: 13 },
  { text: 'Plan', value: 12 },
];

type DateRangeType = 'today' | '7days' | '30days' | 'custom';

const AgentAnalytics = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { agent, isLoading } = useAgentDetails(agentId);
  const [activeTab, setActiveTab] = useState("performance");
  const [dateRange, setDateRange] = useState<DateRangeType>('30days');
  const [channel, setChannel] = useState<string>("all");
  const [date, setDate] = useState<Date>();
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();

  const totalInteractions = interactionsData.reduce(
    (sum, day) => sum + day.voice + day.chat + day.email + day.social, 
    0
  );
  
  const totalCalls = callsData.reduce(
    (sum, day) => sum + day.inbound + day.outbound, 
    0
  );
  
  const totalInboundCalls = callsData.reduce((sum, day) => sum + day.inbound, 0);
  const totalOutboundCalls = callsData.reduce((sum, day) => sum + day.outbound, 0);
  const inboundPercentage = Math.round((totalInboundCalls / totalCalls) * 100);
  const outboundPercentage = Math.round((totalOutboundCalls / totalCalls) * 100);
  
  const testCoverage = testingData.slice(-1)[0];
  const coveragePercentage = testCoverage ? testCoverage.completed : 0;
  
  const latestSentiment = sentimentData.slice(-1)[0];
  const positivePercentage = latestSentiment ? latestSentiment.positive : 0;
  const neutralPercentage = latestSentiment ? latestSentiment.neutral : 0;
  const negativePercentage = latestSentiment ? latestSentiment.negative : 0;
  
  // Filter data based on selected date range
  const filterDataByDateRange = (data: any[]) => {
    switch (dateRange) {
      case 'today':
        return data.slice(-1);
      case '7days':
        return data.slice(-7);
      case '30days':
        return data;
      case 'custom':
        if (customDateFrom && customDateTo) {
          // This is a simplification - in a real app, you'd filter based on actual dates
          const daysDiff = Math.min(30, Math.round((customDateTo.getTime() - customDateFrom.getTime()) / (1000 * 60 * 60 * 24)));
          return data.slice(-daysDiff);
        }
        return data;
      default:
        return data;
    }
  };

  const filteredAvmScoreData = filterDataByDateRange(avmScoreData);
  const filteredInteractionsData = filterDataByDateRange(interactionsData);
  const filteredCallsData = filterDataByDateRange(callsData);
  const filteredTestingData = filterDataByDateRange(testingData);
  const filteredSentimentData = filterDataByDateRange(sentimentData);

  const latestAvmScore = avmScoreData.slice(-1)[0]?.score || 0;
  const previousAvmScore = avmScoreData.slice(-2)[0]?.score || 0;
  const avmScoreChange = ((latestAvmScore - previousAvmScore) / previousAvmScore) * 100;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-agent-primary border-t-transparent"></div>
        <span className="mt-2 text-muted-foreground">Loading analytics data...</span>
      </div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{agent?.name} Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive performance metrics and insights for your AI agent
        </p>
      </div>

      {/* Header Section: Global Controls */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Global Controls & Summary</CardTitle>
          <CardDescription>
            Filter data and view high-level metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Date Range Filter */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRangeType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                
                {dateRange === 'custom' && (
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateFrom ? format(customDateFrom, "MMM dd") : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={customDateFrom}
                          onSelect={setCustomDateFrom}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDateTo ? format(customDateTo, "MMM dd") : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={customDateTo}
                          onSelect={setCustomDateTo}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
            
            {/* Channel Filter */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Channel</label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            {/* AVM Score */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">AVM Score</span>
                    <div className="flex items-end mt-1">
                      <span className="text-2xl font-bold">{latestAvmScore.toFixed(1)}</span>
                      <span className="text-xs ml-1 mb-0.5 text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <div className={`flex items-center ${avmScoreChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {avmScoreChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    <span className="text-sm font-medium">{Math.abs(avmScoreChange).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Interactions */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Total Interactions</span>
                    <div className="flex items-end mt-1">
                      <span className="text-2xl font-bold">{totalInteractions.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-agent-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-agent-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Calls */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Total Calls</span>
                    <div className="flex items-end mt-1">
                      <span className="text-2xl font-bold">{totalCalls.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* User Sentiment */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Positive Sentiment</span>
                    <div className="flex items-end mt-1">
                      <span className="text-2xl font-bold">{positivePercentage}%</span>
                    </div>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded-full">
                    <Smile className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testing Coverage */}
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Test Coverage</span>
                    <div className="flex items-end mt-1">
                      <span className="text-2xl font-bold">{coveragePercentage}%</span>
                    </div>
                  </div>
                  <div className="bg-purple-500/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Content - Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="performance">
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span>Performance</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="testing">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Testing</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="sentiment">
            <div className="flex items-center">
              <Smile className="h-4 w-4 mr-2" />
              <span>Sentiment</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="topics">
            <div className="flex items-center">
              <Hash className="h-4 w-4 mr-2" />
              <span>Topics</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="channels">
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Channels</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* AVM Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>AVM Score Breakdown</CardTitle>
              <CardDescription>
                Track your agent's overall performance score over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card className="md:col-span-1 bg-card/50 border-border">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground mb-1">Overall AVM Score</span>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{latestAvmScore.toFixed(1)}</span>
                      <span className="text-sm ml-1 text-muted-foreground">/10</span>
                    </div>
                    <div className={`flex items-center mt-2 ${avmScoreChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {avmScoreChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      <span className="text-sm">{Math.abs(avmScoreChange).toFixed(1)}% from previous</span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="md:col-span-3 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredAvmScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toFixed(1)}`, 'AVM Score']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8B5CF6" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                        name="AVM Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Interactions Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Interactions Breakdown</CardTitle>
              <CardDescription>
                Analyze interaction patterns across different channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredInteractionsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="voice" 
                          stackId="1"
                          stroke="#8B5CF6" 
                          fill="#8B5CF6" 
                          name="Voice"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="chat" 
                          stackId="1"
                          stroke="#0EA5E9" 
                          fill="#0EA5E9"
                          name="Chat" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="email" 
                          stackId="1"
                          stroke="#F97316" 
                          fill="#F97316"
                          name="Email" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="social" 
                          stackId="1"
                          stroke="#D946EF" 
                          fill="#D946EF"
                          name="Social" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <Card className="bg-card/50 border-border mb-4">
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Interactions</h4>
                        <p className="text-3xl font-bold mt-1">{totalInteractions.toLocaleString()}</p>
                      </div>
                      
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={channelDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {channelDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Call Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Call Performance Breakdown</CardTitle>
              <CardDescription>
                Insights into your agent's voice communication performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-4">
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Calls</h4>
                      <p className="text-3xl font-bold">{totalCalls.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Inbound vs Outbound</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-500 font-medium">Inbound: {inboundPercentage}%</span>
                        <span className="text-agent-primary font-medium">Outbound: {outboundPercentage}%</span>
                      </div>
                      <div className="w-full bg-secondary mt-2 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-l-full" 
                          style={{ width: `${inboundPercentage}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Call Channels</h4>
                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={callChannelData}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {callChannelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredCallsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="inbound" name="Inbound Calls" fill="#0EA5E9" />
                        <Bar dataKey="outbound" name="Outbound Calls" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testing Coverage Overview</CardTitle>
              <CardDescription>
                Monitor how thoroughly your agent is tested across different features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-card/50 border-border">
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    <div className="relative h-32 w-32 mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="h-32 w-32 rounded-full border-8 border-secondary"
                          style={{
                            background: `conic-gradient(#8B5CF6 ${coveragePercentage}%, transparent 0)`
                          }}
                        ></div>
                        <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold">{coveragePercentage}%</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold">Test Coverage</h4>
                    <p className="text-sm text-muted-foreground mt-1">Overall completion rate</p>
                  </CardContent>
                </Card>
                
                <div className="col-span-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredTestingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="Completed Tests" fill="#22C55E" />
                        <Bar dataKey="inProgress" name="In Progress" fill="#F59E0B" />
                        <Bar dataKey="failed" name="Failed Tests" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Feature Coverage Heatmap</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testFeatureCoverage.map((feature, index) => (
                    <div key={index} className="flex items-center border rounded-md p-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{feature.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-36 bg-secondary rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              feature.coverage >= 90 ? 'bg-green-500' : 
                              feature.coverage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${feature.coverage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{feature.coverage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Sentiment Analysis</CardTitle>
              <CardDescription>
                Track how users feel when interacting with your agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-card/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Smile className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Positive</span>
                    </div>
                    <p className="text-2xl font-bold">{positivePercentage}%</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Smile className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Neutral</span>
                    </div>
                    <p className="text-2xl font-bold">{neutralPercentage}%</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Negative</span>
                    </div>
                    <p className="text-2xl font-bold">{negativePercentage}%</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Change (30d)</span>
                    </div>
                    <p className="text-2xl font-bold">+4.5%</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredSentimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="positive" 
                          stackId="1"
                          stroke="#22C55E" 
                          fill="#22C55E" 
                          name="Positive"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="neutral" 
                          stackId="1"
                          stroke="#F59E0B" 
                          fill="#F59E0B"
                          name="Neutral" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="negative" 
                          stackId="1"
                          stroke="#EF4444" 
                          fill="#EF4444"
                          name="Negative" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Sentiment Breakdown</h4>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sentimentDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {sentimentDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Topics & Conversation Insights</CardTitle>
              <CardDescription>
                Discover what your users are discussing with your agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Word Cloud</CardTitle>
                    <CardDescription>
                      Frequently used words and phrases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 justify-center p-4">
                      {wordCloudData.map((word, index) => {
                        const size = Math.max(0.8, Math.min(3, word.value / 20));
                        const opacity = Math.max(0.5, Math.min(1, word.value / 60));
                        return (
                          <div 
                            key={index}
                            className="hover:text-agent-primary cursor-pointer transition-colors"
                            style={{ 
                              fontSize: `${size}rem`,
                              opacity: opacity,
                              padding: '0.2rem 0.5rem',
                            }}
                            title={`${word.text}: mentioned ${word.value} times`}
                          >
                            {word.text}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <div>
                  <Card className="bg-card/50 border-border mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Top Topics</CardTitle>
                      <CardDescription>
                        Most common conversation topics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topTopicsData.map((topic, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{topic.name}</span>
                              <span className="text-xs text-muted-foreground">{topic.value}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full" 
                                style={{ width: `${topic.value}%`, backgroundColor: topic.color }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Topic Trends</CardTitle>
                      <CardDescription>
                        How topics change over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={filteredAvmScoreData.map((item, index) => ({
                            date: item.date,
                            "Issue Resolution": 30 + Math.floor(Math.random() * 10),
                            "Billing Questions": 20 + Math.floor(Math.random() * 15),
                            "Technical Support": 15 + Math.floor(Math.random() * 12),
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Issue Resolution" stroke="#8B5CF6" />
                            <Line type="monotone" dataKey="Billing Questions" stroke="#0EA5E9" />
                            <Line type="monotone" dataKey="Technical Support" stroke="#F97316" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interaction Channel Breakdown</CardTitle>
              <CardDescription>
                Compare performance across different communication channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-card/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Channel Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channelDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {channelDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="col-span-2">
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Channel Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={channelPerformanceData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                            <Legend />
                            <Bar dataKey="responseTime" name="Response Time" fill="#8B5CF6" />
                            <Bar dataKey="successRate" name="Success Rate" fill="#0EA5E9" />
                            <Bar dataKey="sentiment" name="Sentiment" fill="#22C55E" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Card className="mt-6 bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Channel Effectiveness Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredAvmScoreData.map((item, index) => ({
                        date: item.date,
                        "Voice": 75 + Math.floor(Math.random() * 15),
                        "Chat": 70 + Math.floor(Math.random() * 20),
                        "Email": 65 + Math.floor(Math.random() * 15),
                        "Social": 60 + Math.floor(Math.random() * 25),
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Effectiveness']} />
                        <Legend />
                        <Line type="monotone" dataKey="Voice" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Chat" stroke="#0EA5E9" strokeWidth={2} />
                        <Line type="monotone" dataKey="Email" stroke="#F97316" strokeWidth={2} />
                        <Line type="monotone" dataKey="Social" stroke="#D946EF" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentAnalytics;
