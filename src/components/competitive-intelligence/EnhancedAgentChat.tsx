import React from 'react';
import { RepairedAgentChat } from './RepairedAgentChat';

// ... keep existing code (imports and interface)

interface EnhancedAgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function EnhancedAgentChat({ agentId, sessionConfig }: EnhancedAgentChatProps) {
  return (
    <RepairedAgentChat agentId={agentId} sessionConfig={sessionConfig} />
  );
}
