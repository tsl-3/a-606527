
export type AgentType = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "inactive";
  createdAt: string;
  interactions: number;
  isPersonal: boolean;
  model?: string;
  channels?: string[]; // Array of available channels: "voice", "chat", "sms", "email", "whatsapp"
};
