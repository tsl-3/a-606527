
import { useState, useEffect } from 'react';
import { fetchAgentById } from '@/services/agentService';
import { AgentType } from '@/types/agent';

export const useAgentDetails = (agentId: string | undefined) => {
  const [agent, setAgent] = useState<AgentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setError("Agent ID is required");
      setIsLoading(false);
      return;
    }

    const loadAgentDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAgentById(agentId);
        
        // Add default stats if not provided from the API
        const enhancedData: AgentType = {
          ...data,
          avmScore: data.avmScore || 7.8,
          interactions: data.interactions || 1300,
          csat: data.csat || 85,
          performance: data.performance || 92
        };
        
        setAgent(enhancedData);
        setError(null);
      } catch (err) {
        setError("Failed to load agent details");
        console.error("Error loading agent details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentDetails();
  }, [agentId]);

  return { agent, isLoading, error };
};
