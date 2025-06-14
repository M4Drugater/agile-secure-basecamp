
import React, { useState } from 'react';
import { useStrategicAnalysis } from '@/hooks/competitive-intelligence/useStrategicAnalysis';
import { AnalysisHeader } from './analysis/AnalysisHeader';
import { AnalysisResultsTabs } from './analysis/AnalysisResultsTabs';

interface StrategicAnalysisPanelProps {
  agentType: string;
  analysisData: any;
}

export function StrategicAnalysisPanel({ agentType, analysisData }: StrategicAnalysisPanelProps) {
  const { 
    strategicFrameworks, 
    analysisResults, 
    isAnalyzing,
    runComprehensiveAnalysis 
  } = useStrategicAnalysis();
  
  const [selectedFramework, setSelectedFramework] = useState('Porter\'s Five Forces');

  const handleRunAnalysis = async () => {
    await runComprehensiveAnalysis(analysisData, {});
  };

  return (
    <div className="space-y-6">
      <AnalysisHeader
        agentType={agentType}
        selectedFramework={selectedFramework}
        strategicFrameworks={strategicFrameworks}
        isAnalyzing={isAnalyzing}
        onRunAnalysis={handleRunAnalysis}
        onFrameworkSelect={setSelectedFramework}
      />

      {analysisResults && (
        <AnalysisResultsTabs analysisResults={analysisResults} />
      )}
    </div>
  );
}
