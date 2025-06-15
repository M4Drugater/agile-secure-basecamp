
import React from 'react';
import { FixedAgentChat } from './FixedAgentChat';

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
    <FixedAgentChat agentId={agentId} sessionConfig={sessionConfig} />
  );
}
