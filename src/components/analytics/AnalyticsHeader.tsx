
import React, { useState } from "react";
import { 
  Calendar, 
  ChevronDown, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Phone, 
  Smile, 
  FlaskConical 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AgentType } from "@/types/agent";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AnalyticsHeaderProps {
  agent: AgentType;
}

type DateRangeType = "today" | "7days" | "30days" | "custom";

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ agent }) => {
  const [dateRange, setDateRange] = useState<DateRangeType>("7days");
  const [channel, setChannel] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get display text for date range
  const getDateRangeText = () => {
    switch (dateRange) {
      case "today":
        return "Today";
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "custom":
        return date ? format(date, "PPP") : "Select Date";
    }
  };

  // Calculate percent change helper (randomly generated for demo)
  const getPercentChange = (baseValue: number) => {
    const change = (Math.random() * 20) - 10; // Random between -10% and +10%
    return {
      value: change.toFixed(1), 
      isPositive: change > 0
    };
  };

  // Calculate sentiment distribution (for demo purposes)
  const sentimentDistribution = {
    positive: 65,
    neutral: 24,
    negative: 11
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-between">
              <Calendar className="mr-2 h-4 w-4" />
              {getDateRangeText()}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b">
              <div className="flex items-center gap-2">
                <Button 
                  variant={dateRange === "today" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setDateRange("today")}
                >
                  Today
                </Button>
                <Button 
                  variant={dateRange === "7days" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setDateRange("7days")}
                >
                  7 Days
                </Button>
                <Button 
                  variant={dateRange === "30days" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setDateRange("30days")}
                >
                  30 Days
                </Button>
                <Button 
                  variant={dateRange === "custom" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setDateRange("custom")}
                >
                  Custom
                </Button>
              </div>
            </div>
            {dateRange === "custom" && (
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className={cn("p-3 pointer-events-auto")}
              />
            )}
          </PopoverContent>
        </Popover>

        {/* Channel Filter */}
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Channels" />
            </div>
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

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* AVM Score Card */}
        <Card className="bg-white dark:bg-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">AVM Score</p>
                <div className="flex items-end gap-1">
                  <p className="text-2xl font-bold">{agent.avmScore?.toFixed(1) || "7.8"}</p>
                  <p className="text-xs text-muted-foreground mb-1">/10</p>
                </div>
              </div>
              <div className={`flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                getPercentChange(agent.avmScore || 7.8).isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {getPercentChange(agent.avmScore || 7.8).isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {getPercentChange(agent.avmScore || 7.8).value}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Interactions Card */}
        <Card className="bg-white dark:bg-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
                <div className="flex items-end gap-1">
                  <p className="text-2xl font-bold">{agent.interactions?.toLocaleString() || "1,245"}</p>
                </div>
              </div>
              <div className={`flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                getPercentChange(agent.interactions || 1245).isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {getPercentChange(agent.interactions || 1245).isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {getPercentChange(agent.interactions || 1245).value}%
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <Separator orientation="vertical" className="mx-2 h-3" />
              <span className="text-xs text-muted-foreground">725 inbound, 520 outbound</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Calls Card */}
        <Card className="bg-white dark:bg-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Voice Interactions</p>
                <div className="flex items-end gap-1">
                  <p className="text-2xl font-bold">512</p>
                </div>
              </div>
              <div className={`flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                getPercentChange(512).isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {getPercentChange(512).isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {getPercentChange(512).value}%
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <Separator orientation="vertical" className="mx-2 h-3" />
              <span className="text-xs text-muted-foreground">65% inbound, 35% outbound</span>
            </div>
          </CardContent>
        </Card>

        {/* User Sentiment Card */}
        <Card className="bg-white dark:bg-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">User Sentiment</p>
                <div className="flex items-end gap-1">
                  <p className="text-2xl font-bold">{sentimentDistribution.positive}%</p>
                  <p className="text-xs text-muted-foreground mb-1">positive</p>
                </div>
              </div>
              <div className={`flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                getPercentChange(sentimentDistribution.positive).isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {getPercentChange(sentimentDistribution.positive).isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {getPercentChange(sentimentDistribution.positive).value}%
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Smile className="h-3.5 w-3.5 text-muted-foreground" />
              <Separator orientation="vertical" className="mx-2 h-3" />
              <span className="text-xs text-muted-foreground">
                {sentimentDistribution.neutral}% neutral, {sentimentDistribution.negative}% negative
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Testing Coverage Card */}
        <Card className="bg-white dark:bg-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Testing Coverage</p>
                <div className="flex items-end gap-1">
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
              <div className={`flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                getPercentChange(87).isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {getPercentChange(87).isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {getPercentChange(87).value}%
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FlaskConical className="h-3.5 w-3.5 text-muted-foreground" />
              <Separator orientation="vertical" className="mx-2 h-3" />
              <span className="text-xs text-muted-foreground">
                234 test cases, 87% complete
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
