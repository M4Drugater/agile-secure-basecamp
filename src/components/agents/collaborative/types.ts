
export interface CollaborativeMessage {
  id: string;
  type: 'user' | 'orchestrator' | 'agent-response' | 'synthesis';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentIcon?: React.ComponentType<any>;
  agentColor?: string;
}
