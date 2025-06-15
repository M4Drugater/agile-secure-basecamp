import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  capabilities: string[];
  type: string;
  status: 'active' | 'idle' | 'processing' | 'repaired' | 'unified';
}
