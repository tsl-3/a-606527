
import { AgentType } from '@/types/agent';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const AGENTS_MOCK = [
  {
    id: "1",
    name: "Sales Assistant",
    description: "Sales and product information",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1",
    isActive: true,
    channels: ["voice", "chat", "email"],
    channelConfigs: {
      voice: { enabled: true, details: "+1 (800) 555-0123" },
      chat: { enabled: true, details: "https://example.com/chat" },
      email: { enabled: true, details: "sales@example.com" }
    },
    avmScore: 8.5,
    interactionCount: 1254,
    industry: "technology",
    botFunction: "sales"
  },
  {
    id: "2",
    name: "Support Agent",
    description: "Technical support and troubleshooting",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=2",
    isActive: true,
    channels: ["voice", "chat", "sms"],
    channelConfigs: {
      voice: { enabled: true, details: "+1 (800) 555-0124" },
      chat: { enabled: true, details: "https://example.com/support" },
      sms: { enabled: true, details: "+1 (800) 555-0125" }
    },
    avmScore: 9.2,
    interactionCount: 3672,
    industry: "technology",
    botFunction: "support"
  },
  {
    id: "3",
    name: "Billing Assistant",
    description: "Billing and payment questions",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=3",
    isActive: false,
    channels: ["voice", "email"],
    channelConfigs: {
      voice: { enabled: true, details: "+1 (800) 555-0126" },
      email: { enabled: true, details: "billing@example.com" }
    },
    avmScore: 7.8,
    interactionCount: 945,
    industry: "finance",
    botFunction: "billing"
  },
  {
    id: "4",
    name: "Onboarding Guide",
    description: "New customer onboarding and setup",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=4",
    isActive: true,
    channels: ["chat", "email", "whatsapp"],
    channelConfigs: {
      chat: { enabled: true, details: "https://example.com/onboarding" },
      email: { enabled: true, details: "welcome@example.com" },
      whatsapp: { enabled: true, details: "+1 (800) 555-0127" }
    },
    avmScore: 8.9,
    interactionCount: 512,
    industry: "education",
    botFunction: "onboarding"
  },
  {
    id: "5",
    name: "Appointment Scheduler",
    description: "Schedule and manage appointments",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=5",
    isActive: true,
    channels: ["voice", "sms", "chat"],
    channelConfigs: {
      voice: { enabled: true, details: "+1 (800) 555-0128" },
      sms: { enabled: true, details: "+1 (800) 555-0129" },
      chat: { enabled: true, details: "https://example.com/appointments" }
    },
    avmScore: 9.5,
    interactionCount: 2341,
    industry: "healthcare",
    botFunction: "booking"
  }
];

// Function to transform DB row to AgentType
const transformDbRowToAgent = (row: any): AgentType => {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    avatar: row.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.id}`,
    isActive: row.active || false,
    channels: row.channels || [],
    channelConfigs: row.channelConfigs || {},
    avmScore: 8.0, // Default score
    interactionCount: 0, // Default count
    purpose: row.purpose || '',
    prompt: row.prompt || '',
    industry: row.industry || '',
    botFunction: row.botFunction || '',
    model: row.model || 'GPT-4',
    voice: row.voice || '',
    voiceProvider: row.voiceProvider || '',
    customIndustry: row.customIndustry || '',
    customFunction: row.customFunction || ''
  };
};

// Migrate mock data to Supabase on first load (only in development)
let hasMigratedMockData = false;
const migrateMockDataToSupabase = async () => {
  if (hasMigratedMockData || import.meta.env.PROD) return;
  
  // Check if we already have agents in the database
  const { data } = await supabase.from('agents').select('id').limit(1);
  if (data && data.length > 0) {
    hasMigratedMockData = true;
    return;
  }
  
  // Insert mock data
  for (const agent of AGENTS_MOCK) {
    await supabase.from('agents').insert({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      avatar: agent.avatar,
      active: agent.isActive,
      channels: agent.channels,
      channelConfigs: agent.channelConfigs,
      industry: agent.industry,
      botFunction: agent.botFunction,
      created_at: new Date().toISOString()
    });
  }
  
  hasMigratedMockData = true;
};

export const getAgents = async (): Promise<AgentType[]> => {
  await migrateMockDataToSupabase();
  
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching agents:', error);
    // Fallback to mock data if there's an error
    return AGENTS_MOCK;
  }
  
  return data.map(transformDbRowToAgent);
};

export const getAgentById = async (id: string): Promise<AgentType | null> => {
  await migrateMockDataToSupabase();
  
  // Special case for new agent
  if (id === 'new123') {
    return {
      id: 'new123',
      name: '',
      description: '',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(2, 10)}`,
      isActive: false,
      channels: [],
      channelConfigs: {},
      avmScore: undefined,
      interactionCount: 0,
      purpose: '',
      prompt: '',
      industry: '',
      botFunction: '',
      model: 'GPT-4',
      voice: '9BWtsMINqrJLrRacOk9x', // Default voice
      voiceProvider: 'Eleven Labs', // Default provider
    };
  }
  
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching agent with id ${id}:`, error);
    if (error.code === 'PGRST116') {
      throw new Error(`Agent with id ${id} not found`);
    }
    throw error;
  }
  
  return transformDbRowToAgent(data);
};

export const createAgent = async (agent: Partial<AgentType>): Promise<AgentType> => {
  await migrateMockDataToSupabase();
  
  const newId = agent.id === 'new123' ? uuidv4() : agent.id || uuidv4();
  
  const newAgent = {
    id: newId,
    name: agent.name || 'New Agent',
    description: agent.description || '',
    purpose: agent.purpose || '',
    prompt: agent.prompt || '',
    industry: agent.industry || '',
    botFunction: agent.botFunction || '',
    model: agent.model || 'GPT-4',
    avatar: agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`,
    voice: agent.voice || '9BWtsMINqrJLrRacOk9x',
    voiceProvider: agent.voiceProvider || 'Eleven Labs',
    active: agent.isActive || false,
    channels: agent.channels || [],
    channelConfigs: agent.channelConfigs || {},
    customIndustry: agent.customIndustry || null,
    customFunction: agent.customFunction || null,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('agents')
    .insert(newAgent)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
  
  return transformDbRowToAgent(data);
};

export const updateAgent = async (id: string, updates: Partial<AgentType>): Promise<AgentType> => {
  await migrateMockDataToSupabase();
  
  // Handle special case for new agent
  if (id === 'new123') {
    return createAgent(updates);
  }
  
  // Prepare updates for Supabase (transform from AgentType to database schema)
  const dbUpdates = {
    name: updates.name,
    description: updates.description,
    purpose: updates.purpose,
    prompt: updates.prompt,
    industry: updates.industry,
    botFunction: updates.botFunction,
    model: updates.model,
    avatar: updates.avatar,
    voice: updates.voice,
    voiceProvider: updates.voiceProvider,
    active: updates.isActive,
    channels: updates.channels,
    channelConfigs: updates.channelConfigs,
    customIndustry: updates.customIndustry,
    customFunction: updates.customFunction
  };
  
  // Remove undefined values
  Object.keys(dbUpdates).forEach(key => {
    if (dbUpdates[key as keyof typeof dbUpdates] === undefined) {
      delete dbUpdates[key as keyof typeof dbUpdates];
    }
  });
  
  const { data, error } = await supabase
    .from('agents')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating agent with id ${id}:`, error);
    throw error;
  }
  
  return transformDbRowToAgent(data);
};

export const deleteAgent = async (id: string): Promise<void> => {
  await migrateMockDataToSupabase();
  
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting agent with id ${id}:`, error);
    throw error;
  }
};

export const toggleAgentActive = async (id: string, isActive: boolean): Promise<AgentType> => {
  return updateAgent(id, { isActive });
};
