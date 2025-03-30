
import { AgentType } from '@/types/agent';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Function to transform DB row to AgentType
const transformDbRowToAgent = (row: any): AgentType => {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    avatar: row.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.id}`,
    isActive: row.active || false,
    status: row.active ? "active" : "inactive",
    channels: row.channels || [],
    channelConfigs: row.channelConfigs || {},
    avmScore: 8.0, // Default score
    interactions: 0, // Default count
    interactionCount: 0, // Support both property names
    purpose: row.purpose || '',
    prompt: row.prompt || '',
    industry: row.industry || '',
    botFunction: row.botFunction || '',
    model: row.model || 'GPT-4',
    voice: row.voice || '',
    voiceProvider: row.voiceProvider || '',
    customIndustry: row.customIndustry || '',
    customFunction: row.customFunction || '',
    createdAt: row.created_at || new Date().toISOString()
  };
};

export const getAgents = async (): Promise<AgentType[]> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
  
  return data.map(transformDbRowToAgent);
};

export const getAgentById = async (id: string): Promise<AgentType | null> => {
  // Special case for new agent
  if (id === 'new123') {
    return {
      id: 'new123',
      name: '',
      description: '',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(2, 10)}`,
      isActive: false,
      status: "inactive",
      channels: [],
      channelConfigs: {},
      avmScore: undefined,
      interactions: 0,
      interactionCount: 0,
      purpose: '',
      prompt: '',
      industry: '',
      botFunction: '',
      model: 'GPT-4',
      voice: '9BWtsMINqrJLrRacOk9x', // Default voice
      voiceProvider: 'Eleven Labs', // Default provider
      createdAt: new Date().toISOString()
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
  const newId = agent.id === 'new123' ? uuidv4() : agent.id || uuidv4();
  
  // Prepare the agent data for Supabase (transform from AgentType to database schema)
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
    customFunction: agent.customFunction || null
  };
  
  console.log('Creating new agent with data:', newAgent);
  
  const { data, error } = await supabase
    .from('agents')
    .insert(newAgent)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
  
  console.log('Agent created successfully:', data);
  return transformDbRowToAgent(data);
};

export const updateAgent = async (id: string, updates: Partial<AgentType>): Promise<AgentType> => {
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
  
  console.log(`Updating agent with id ${id} with data:`, dbUpdates);
  
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
  
  console.log('Agent updated successfully:', data);
  return transformDbRowToAgent(data);
};

export const deleteAgent = async (id: string): Promise<void> => {
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
