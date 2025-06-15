
export interface LaigentRequest {
  userQuery: string;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  sessionConfig?: any;
  orchestrationLevel: 'standard' | 'advanced' | 'elite';
  customParameters?: {
    researchDepth?: 'surface' | 'standard' | 'deep' | 'comprehensive';
    stylingFormality?: 'professional' | 'executive' | 'c-suite';
    outputFormat?: 'brief' | 'detailed' | 'comprehensive';
  };
}

export interface LaigentResponse {
  finalContent: string;
  orchestrationMetadata: {
    contextQuality: number;
    researchQuality: number;
    stylingQuality: number;
    overallScore: number;
    processingTime: number;
    agentCoordination: string[];
  };
  performanceAnalytics: {
    contextBuildTime: number;
    researchTime: number;
    stylingTime: number;
    totalTokens: number;
    totalCost: string;
  };
  qualityAssurance: {
    executiveReadiness: number;
    strategicDepth: number;
    dataIntegration: number;
    actionability: number;
  };
}

export interface OrchestrationStatus {
  isOrchestrating: boolean;
  currentStage: string;
  stageProgress: number;
}
