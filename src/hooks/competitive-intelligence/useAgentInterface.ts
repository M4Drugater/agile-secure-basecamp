
import { useState } from 'react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

export function useAgentInterface() {
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  return {
    sessionConfig,
    setSessionConfig
  };
}
