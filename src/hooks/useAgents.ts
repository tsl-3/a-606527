
import { useState, useEffect } from 'react';
import { fetchAgents } from '@/services/agentService';
import { AgentType } from '@/types/agent';

// Helper function to generate a random phone number
const generateRandomPhone = (id: string) => {
  const areaCode = 100 + (id.charCodeAt(0) % 900);
  const firstPart = 100 + (id.charCodeAt(1) % 900);
  const secondPart = 1000 + (id.charCodeAt(2) % 9000);
  return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
};

// Helper function to generate a random email based on agent name
const generateRandomEmail = (id: string, name: string) => {
  const domains = ['agentai.com', 'assistants.io', 'aihelpers.org', 'botmail.net'];
  const domainIndex = id.charCodeAt(3) % domains.length;
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${normalizedName}${id.slice(0, 3)}@${domains[domainIndex]}`;
};

export const useAgents = (filter: string = 'all-agents') => {
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAgents(filter);
        
        // Add phone and email to each agent
        const enhancedData = data.map(agent => ({
          ...agent,
          phone: generateRandomPhone(agent.id),
          email: generateRandomEmail(agent.id, agent.name)
        }));
        
        setAgents(enhancedData);
        setError(null);
      } catch (err) {
        setError("Failed to load agents");
        console.error("Error loading agents:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, [filter]);

  return { agents, isLoading, error };
};
