
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
        
        // Add default stats if missing
        const channelConfigs = data.channelConfigs || {};
        
        // Ensure voice channel is configured with a phone number
        if (!channelConfigs.voice) {
          channelConfigs.voice = {
            enabled: true,
            details: "+1 (800) 555-1234"
          };
        }
        
        // Ensure chat channel is configured
        if (!channelConfigs.chat) {
          channelConfigs.chat = {
            enabled: true,
            details: "https://yourcompany.com/chat"
          };
        }
        
        // Ensure email channel is configured
        if (!channelConfigs.email) {
          channelConfigs.email = {
            enabled: true,
            details: "support@yourcompany.com"
          };
        }
        
        const enhancedData = {
          ...data,
          interactions: data.interactions || 0,
          csat: data.csat || 85,
          performance: data.performance || 92,
          avmScore: data.avmScore || 7.8,
          channels: data.channels || ["voice", "chat", "email"],
          channelConfigs: channelConfigs,
        };
        
        setAgent(enhancedData);
        setError(null);
      } catch (err) {
        console.error("Error loading agent details:", err);
        setError("Failed to load agent details");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentDetails();
  }, [agentId]);

  return { agent, isLoading, error };
};
