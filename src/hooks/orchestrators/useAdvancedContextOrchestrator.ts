
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ContextProfile {
  userId: string;
  industryExpertise: string[];
  managementLevel: string;
  experienceYears: number;
  functionalAreas: string[];
  preferredAnalysisStyle: string;
  communicationPreferences: {
    formality: 'executive' | 'professional' | 'casual';
    detail: 'high-level' | 'detailed' | 'comprehensive';
    format: 'structured' | 'narrative' | 'bullet-points';
  };
}

interface DynamicCalibration {
  agentType: string;
  contextDepth: number;
  professionalAlignment: number;
  industryRelevance: number;
  executiveReadiness: number;
}

export function useAdvancedContextOrchestrator() {
  const { user } = useAuth();
  const [contextProfile, setContextProfile] = useState<ContextProfile | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const buildAdvancedContext = async (agentType: string, userQuery: string) => {
    if (!user) throw new Error('User authentication required');

    setIsBuilding(true);
    console.log('🎯 LAIGENT Context Orchestrator - Building advanced context');

    try {
      // 1. Enhanced User Profile Service
      const profile = await buildEnhancedUserProfile(user.id);
      setContextProfile(profile);

      // 2. Knowledge Base Integration
      const knowledgeContext = await integrateKnowledgeBase(user.id, userQuery);

      // 3. Dynamic Agent Calibration
      const calibration = await calibrateAgentDynamically(agentType, profile, userQuery);

      // 4. Build Comprehensive Context
      const advancedContext = {
        userProfile: profile,
        knowledgeIntegration: knowledgeContext,
        agentCalibration: calibration,
        sessionMetadata: {
          timestamp: new Date().toISOString(),
          contextVersion: '2.0-laigent',
          orchestratorType: 'advanced'
        }
      };

      console.log('✅ Advanced context built:', {
        profileCompleteness: calculateProfileCompleteness(profile),
        knowledgeAssets: knowledgeContext.assetCount,
        calibrationScore: calibration.executiveReadiness
      });

      return advancedContext;

    } catch (error) {
      console.error('❌ Context orchestration error:', error);
      throw error;
    } finally {
      setIsBuilding(false);
    }
  };

  const buildEnhancedUserProfile = async (userId: string): Promise<ContextProfile> => {
    // Fetch comprehensive user data from existing profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Create profile with fallbacks using existing profile structure
    return {
      userId,
      industryExpertise: profile?.industry ? [profile.industry] : ['technology'],
      managementLevel: profile?.management_level || 'senior',
      experienceYears: profile?.years_of_experience || 10,
      functionalAreas: profile?.current_skills || ['strategy'],
      preferredAnalysisStyle: 'strategic',
      communicationPreferences: {
        formality: profile?.communication_style === 'formal' ? 'executive' : 'professional',
        detail: 'comprehensive',
        format: 'structured'
      }
    };
  };

  const integrateKnowledgeBase = async (userId: string, query: string) => {
    // Search personal knowledge base using existing user_knowledge_files table
    const { data: personalKnowledge } = await supabase
      .from('user_knowledge_files')
      .select('*')
      .eq('user_id', userId)
      .limit(10);

    // Search system knowledge using existing system_knowledge_base table
    const { data: systemKnowledge } = await supabase
      .from('system_knowledge_base')
      .select('*')
      .textSearch('content', query)
      .limit(5);

    return {
      assetCount: (personalKnowledge?.length || 0) + (systemKnowledge?.length || 0),
      personalAssets: personalKnowledge || [],
      systemAssets: systemKnowledge || [],
      integrationScore: calculateKnowledgeRelevance(query, personalKnowledge, systemKnowledge)
    };
  };

  const calibrateAgentDynamically = async (
    agentType: string,
    profile: ContextProfile,
    query: string
  ): Promise<DynamicCalibration> => {
    // Calculate dynamic calibration scores
    const contextDepth = calculateContextDepth(query, profile);
    const professionalAlignment = calculateProfessionalAlignment(agentType, profile);
    const industryRelevance = calculateIndustryRelevance(query, profile.industryExpertise);
    const executiveReadiness = calculateExecutiveReadiness(profile, agentType);

    return {
      agentType,
      contextDepth,
      professionalAlignment,
      industryRelevance,
      executiveReadiness
    };
  };

  // Helper functions
  const calculateProfileCompleteness = (profile: ContextProfile): number => {
    let score = 0;
    if (profile.industryExpertise.length > 0) score += 0.2;
    if (profile.managementLevel) score += 0.2;
    if (profile.experienceYears > 0) score += 0.2;
    if (profile.functionalAreas.length > 0) score += 0.2;
    if (profile.preferredAnalysisStyle) score += 0.2;
    return score;
  };

  const calculateKnowledgeRelevance = (query: string, personal: any[], system: any[]): number => {
    // Simple relevance calculation based on asset count and query complexity
    const totalAssets = (personal?.length || 0) + (system?.length || 0);
    const queryComplexity = query.split(' ').length / 10; // Normalize
    return Math.min(totalAssets * 0.1 + queryComplexity, 1.0);
  };

  const calculateContextDepth = (query: string, profile: ContextProfile): number => {
    const queryLength = query.length;
    const complexityIndicators = ['analyze', 'strategy', 'competitive', 'market'].filter(
      keyword => query.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min((queryLength / 200) + (complexityIndicators * 0.2), 1.0);
  };

  const calculateProfessionalAlignment = (agentType: string, profile: ContextProfile): number => {
    const alignmentMap: Record<string, number> = {
      'clipogino': profile.managementLevel === 'c-suite' ? 1.0 : 0.8,
      'cdv': profile.functionalAreas.includes('strategy') ? 0.9 : 0.7,
      'cir': profile.functionalAreas.includes('analytics') ? 0.9 : 0.7,
      'cia': profile.managementLevel === 'senior' ? 0.9 : 0.6
    };
    
    return alignmentMap[agentType] || 0.7;
  };

  const calculateIndustryRelevance = (query: string, expertise: string[]): number => {
    const industryKeywords = expertise.flatMap(exp => exp.split(' '));
    const matches = industryKeywords.filter(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(matches * 0.3, 1.0);
  };

  const calculateExecutiveReadiness = (profile: ContextProfile, agentType: string): number => {
    let score = 0;
    
    // Management level factor
    const levelScores = { 'c-suite': 1.0, 'senior': 0.8, 'mid': 0.6, 'junior': 0.4 };
    score += levelScores[profile.managementLevel as keyof typeof levelScores] || 0.5;
    
    // Experience factor
    score += Math.min(profile.experienceYears / 20, 0.5);
    
    // Communication preference alignment
    if (profile.communicationPreferences.formality === 'executive') score += 0.3;
    if (profile.communicationPreferences.detail === 'comprehensive') score += 0.2;
    
    return Math.min(score, 1.0);
  };

  return {
    buildAdvancedContext,
    contextProfile,
    isBuilding
  };
}
