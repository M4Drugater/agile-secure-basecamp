
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { availableAgents } from '../config/availableAgents';

export function useConsolidatedAgentsHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMode, setActiveMode] = useState<'orchestrator' | 'workspace'>('orchestrator');
  const [selectedBucket, setSelectedBucket] = useState<any>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  // Handle URL parameters for direct agent access
  useEffect(() => {
    const mode = searchParams.get('mode') || 'orchestrator';
    const tab = searchParams.get('tab');
    const agent = searchParams.get('agent');
    
    if (mode === 'workspace' || tab || agent) {
      setActiveMode('workspace');
      if (agent && availableAgents.find(a => a.id === agent)) {
        setSelectedAgents([agent]);
      }
    } else {
      setActiveMode('orchestrator');
    }
  }, [searchParams]);

  const handleModeSwitch = (mode: 'orchestrator' | 'workspace') => {
    setActiveMode(mode);
    setSearchParams({ mode });
    // Reset states when switching modes
    if (mode === 'orchestrator') {
      setSelectedAgents([]);
      setSelectedBucket(null);
    }
  };

  const handleSelectBucket = (bucket: any) => {
    setSelectedBucket(bucket);
  };

  const handleBackToBuckets = () => {
    setSelectedBucket(null);
  };

  const handleAgentSelect = (agentId: string) => {
    if (collaborativeMode) {
      setSelectedAgents(prev => 
        prev.includes(agentId) 
          ? prev.filter(id => id !== agentId)
          : [...prev, agentId]
      );
    } else {
      setSelectedAgents([agentId]);
      setSearchParams({ mode: 'workspace', agent: agentId });
    }
  };

  const getSelectedAgentConfigs = () => {
    return availableAgents.filter(agent => selectedAgents.includes(agent.id));
  };

  const handleBackFromCollaborative = () => {
    setCollaborativeMode(false);
    setSelectedAgents([]);
  };

  return {
    activeMode,
    selectedBucket,
    selectedAgents,
    collaborativeMode,
    sessionConfig,
    handleModeSwitch,
    handleSelectBucket,
    handleBackToBuckets,
    handleAgentSelect,
    getSelectedAgentConfigs,
    handleBackFromCollaborative,
    setSessionConfig
  };
}
