
export type AgentStatus = "active" | "inactive" | "draft";
export type AgentType = "customer-support" | "sales" | "technical-support" | "personal-assistant" | "custom";

export interface AgentChannelConfig {
  enabled: boolean;
  details?: string;
  config?: Record<string, any>;
}

export interface AgentType {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  createdAt: string;
  updatedAt?: string;
  model?: string;
  voice?: string;
  voiceProvider?: string;
  avmScore?: number;
  interactions?: number;
  channels?: string[];
  channelConfigs?: Record<string, AgentChannelConfig>;
}
