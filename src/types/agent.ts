
export type AgentStatus = "active" | "inactive" | "draft";
export type AgentTypeCategory = "customer-support" | "sales" | "technical-support" | "personal-assistant" | "custom";

export interface AgentChannelConfig {
  enabled: boolean;
  details?: string;
  config?: Record<string, any>;
}

export interface AgentType {
  id: string;
  name: string;
  description: string;
  type: AgentTypeCategory;
  status: AgentStatus;
  createdAt: string;
  updatedAt?: string;
  model?: string;
  voice?: string;
  voiceProvider?: string;
  avmScore?: number;
  interactions?: number;
  csat?: number;
  performance?: number;
  channels?: string[];
  channelConfigs?: Record<string, AgentChannelConfig>;
  isPersonal?: boolean;
}
