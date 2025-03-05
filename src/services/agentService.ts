
import { AgentType } from '@/types/agent';

// Mock data for development
const mockAgents: AgentType[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets automatically.",
    type: "Customer Service",
    status: "active",
    createdAt: "2023-10-15",
    interactions: 1253,
    isPersonal: true,
    model: "GPT-4"
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Guides customers through the sales process and answers product questions.",
    type: "Sales",
    status: "active",
    createdAt: "2023-11-22",
    interactions: 876,
    isPersonal: false,
    model: "Claude-2"
  },
  {
    id: "3",
    name: "Knowledge Base Agent",
    description: "Provides information from company documentation and knowledge base.",
    type: "Knowledge Base",
    status: "inactive",
    createdAt: "2024-01-05",
    interactions: 432,
    isPersonal: true,
    model: "GPT-3.5 Turbo"
  },
  {
    id: "4",
    name: "Meeting Scheduler",
    description: "Helps schedule and manage meetings with clients and team members.",
    type: "Custom",
    status: "active",
    createdAt: "2024-02-10",
    interactions: 198,
    isPersonal: false,
    model: "LLama-2"
  },
  {
    id: "5",
    name: "Document Analyzer",
    description: "Analyzes documents and extracts key information automatically.",
    type: "Custom",
    status: "inactive",
    createdAt: "2024-03-01",
    interactions: 52,
    isPersonal: true,
    model: "GPT-4"
  }
];

// Simulating API call to fetch agents
export const fetchAgents = async (filter: string): Promise<AgentType[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter the mock data based on the filter parameter
  if (filter === 'my-agents') {
    return mockAgents.filter(agent => agent.isPersonal);
  } else if (filter === 'team-agents') {
    return mockAgents.filter(agent => !agent.isPersonal);
  }
  
  // Default: return all agents
  return mockAgents;
};

// Simulating API call to fetch agent by ID
export const fetchAgentById = async (agentId: string): Promise<AgentType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const agent = mockAgents.find(a => a.id === agentId);
  
  if (!agent) {
    throw new Error(`Agent with id ${agentId} not found`);
  }
  
  return agent;
};

// Simulating API call to create a new agent
export const createAgent = async (agentData: Omit<AgentType, 'id' | 'createdAt' | 'interactions'>): Promise<AgentType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a new agent with mock data
  const newAgent: AgentType = {
    ...agentData,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString().split('T')[0],
    interactions: 0
  };
  
  // In a real app, you would add this to the database
  // mockAgents.push(newAgent);
  
  return newAgent;
};

// Simulating API call to update an agent
export const updateAgent = async (agentId: string, agentData: Partial<AgentType>): Promise<AgentType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const agent = mockAgents.find(a => a.id === agentId);
  
  if (!agent) {
    throw new Error(`Agent with id ${agentId} not found`);
  }
  
  // Update the agent
  const updatedAgent = { ...agent, ...agentData };
  
  // In a real app, you would update this in the database
  // const index = mockAgents.findIndex(a => a.id === agentId);
  // mockAgents[index] = updatedAgent;
  
  return updatedAgent;
};

// Simulating API call to delete an agent
export const deleteAgent = async (agentId: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const agent = mockAgents.find(a => a.id === agentId);
  
  if (!agent) {
    throw new Error(`Agent with id ${agentId} not found`);
  }
  
  // In a real app, you would remove this from the database
  // const index = mockAgents.findIndex(a => a.id === agentId);
  // mockAgents.splice(index, 1);
};
