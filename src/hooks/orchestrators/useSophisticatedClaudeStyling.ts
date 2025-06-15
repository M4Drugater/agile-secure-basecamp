
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfessionalVoice {
  formality: 'c-suite' | 'executive' | 'senior' | 'professional';
  industry: string;
  functionalArea: string;
  communicationStyle: 'direct' | 'consultative' | 'analytical' | 'strategic';
  audienceLevel: 'board' | 'executive' | 'management' | 'team';
}

interface ContentFormat {
  structure: 'executive-summary' | 'detailed-analysis' | 'action-plan' | 'presentation';
  length: 'brief' | 'standard' | 'comprehensive' | 'extensive';
  sections: string[];
  visualElements: boolean;
  dataPresentation: 'narrative' | 'structured' | 'dashboard';
}

interface BrandVoice {
  tone: string[];
  vocabulary: string[];
  avoidanceTerms: string[];
  industryJargon: boolean;
  globalConsiderations: string[];
}

export function useSophisticatedClaudeStyling() {
  const { user } = useAuth();
  const [isStyling, setIsStyling] = useState(false);
  const [stylingMetrics, setStylingMetrics] = useState<any>(null);

  const executeAdvancedStyling = async (
    rawContent: string,
    researchData: any,
    userProfile: any,
    agentType: string
  ) => {
    if (!user) throw new Error('User authentication required');

    setIsStyling(true);
    console.log('✨ LAIGENT Claude Styling - Sophisticated execution');

    try {
      // 1. Professional Voice Calibration
      const voiceProfile = calibrateProfessionalVoice(userProfile, agentType);

      // 2. Content Format Optimization
      const formatSpecs = optimizeContentFormat(agentType, userProfile, rawContent);

      // 3. Brand Voice Integration
      const brandVoice = integrateBrandVoice(userProfile, agentType);

      // 4. Execute Advanced Styling
      const styledContent = await executeClaudeAdvancedStyling(
        rawContent,
        researchData,
        voiceProfile,
        formatSpecs,
        brandVoice
      );

      // 5. Quality Assurance
      const qualityMetrics = await performQualityAssurance(styledContent, voiceProfile);

      setStylingMetrics(qualityMetrics);

      console.log('✅ Sophisticated styling completed:', qualityMetrics);

      return {
        content: styledContent,
        metadata: {
          voiceProfile,
          formatSpecs,
          brandVoice,
          qualityMetrics
        }
      };

    } catch (error) {
      console.error('❌ Advanced styling error:', error);
      throw error;
    } finally {
      setIsStyling(false);
    }
  };

  const calibrateProfessionalVoice = (userProfile: any, agentType: string): ProfessionalVoice => {
    // Determine appropriate voice based on user profile and agent
    const formality = determineFormalityLevel(userProfile);
    const communicationStyle = determineCommStyle(agentType, userProfile);
    const audienceLevel = determineAudienceLevel(userProfile);

    return {
      formality,
      industry: userProfile.industryExpertise?.[0] || 'technology',
      functionalArea: userProfile.functionalAreas?.[0] || 'strategy',
      communicationStyle,
      audienceLevel
    };
  };

  const optimizeContentFormat = (
    agentType: string,
    userProfile: any,
    content: string
  ): ContentFormat => {
    // Determine optimal format based on agent type and content
    const structure = determineStructure(agentType, userProfile);
    const length = determineLength(content, userProfile);
    const sections = determineSections(agentType, structure);

    return {
      structure,
      length,
      sections,
      visualElements: shouldIncludeVisuals(userProfile, agentType),
      dataPresentation: determineDataPresentation(userProfile, agentType)
    };
  };

  const integrateBrandVoice = (userProfile: any, agentType: string): BrandVoice => {
    // Build brand voice profile
    const industryVocab = getIndustryVocabulary(userProfile.industryExpertise?.[0]);
    const agentTone = getAgentTone(agentType);
    
    return {
      tone: agentTone,
      vocabulary: industryVocab,
      avoidanceTerms: ['basically', 'obviously', 'simple', 'easy'],
      industryJargon: userProfile.managementLevel === 'c-suite',
      globalConsiderations: ['inclusive-language', 'cultural-sensitivity']
    };
  };

  const executeClaudeAdvancedStyling = async (
    rawContent: string,
    researchData: any,
    voice: ProfessionalVoice,
    format: ContentFormat,
    brand: BrandVoice
  ) => {
    const sophisticatedPrompt = `You are Claude, an elite executive communication specialist and strategic content architect. Your task is to transform raw research intelligence into sophisticated, C-suite ready content that exemplifies the highest standards of professional communication.

CONTENT TRANSFORMATION MISSION:
Transform the following raw research intelligence into executive-grade content that meets Fortune 500 communication standards.

RAW INTELLIGENCE TO TRANSFORM:
${rawContent}

SUPPORTING RESEARCH DATA:
${JSON.stringify(researchData.metadata || {}, null, 2)}

PROFESSIONAL VOICE CALIBRATION:
- Formality Level: ${voice.formality.toUpperCase()}
- Industry Context: ${voice.industry}
- Functional Expertise: ${voice.functionalArea}
- Communication Style: ${voice.communicationStyle}
- Target Audience: ${voice.audienceLevel}

CONTENT FORMAT SPECIFICATIONS:
- Structure Type: ${format.structure}
- Content Length: ${format.length}
- Required Sections: ${format.sections.join(', ')}
- Visual Elements: ${format.visualElements ? 'Include data visualization recommendations' : 'Text-only focus'}
- Data Presentation: ${format.dataPresentation}

BRAND VOICE INTEGRATION:
- Tone Characteristics: ${brand.tone.join(', ')}
- Industry Vocabulary: ${brand.vocabulary.join(', ')}
- Avoid These Terms: ${brand.avoidanceTerms.join(', ')}
- Industry Jargon Level: ${brand.industryJargon ? 'Executive-appropriate' : 'Accessible'}
- Global Considerations: ${brand.globalConsiderations.join(', ')}

SOPHISTICATED STYLING REQUIREMENTS:

1. **EXECUTIVE PRESENCE**: Write with the authority and gravitas expected at the highest levels of business leadership
2. **STRATEGIC CLARITY**: Every sentence should advance strategic understanding or decision-making
3. **DATA INTEGRATION**: Seamlessly weave quantitative insights into narrative flow
4. **CONSULTANCY GRADE**: Match the quality standards of premier consulting firms (McKinsey, BCG, Bain)
5. **ACTIONABLE INTELLIGENCE**: Ensure every insight connects to strategic implications or recommended actions

MANDATORY STRUCTURE FOR ${format.structure.toUpperCase()}:

${getStructureTemplate(format.structure)}

QUALITY STANDARDS:
- **Precision**: Every claim must be specific, quantified where possible, and source-attributed
- **Concision**: Maximum impact with minimum words - no fluff or filler
- **Flow**: Logical progression from insight to implication to recommendation
- **Voice**: Consistent ${voice.communicationStyle} voice throughout
- **Polish**: Error-free, publication-ready prose

CRITICAL INSTRUCTIONS:
1. Begin with the strongest strategic insight as your opening
2. Support every major point with specific data from the research
3. Use ${voice.functionalArea} frameworks and terminology appropriately
4. Maintain ${voice.formality} formality throughout
5. End with clear, prioritized strategic recommendations
6. Include confidence levels for key assertions where appropriate

Transform this raw intelligence into content worthy of ${voice.audienceLevel}-level strategic decision-making.`;

    const { data, error } = await supabase.functions.invoke('elite-multi-llm-engine', {
      body: {
        messages: [
          {
            role: 'system',
            content: 'You are Claude, an elite executive communication specialist who transforms raw intelligence into sophisticated, C-suite ready strategic content.'
          },
          {
            role: 'user',
            content: sophisticatedPrompt
          }
        ],
        model: 'claude-3-5-sonnet-20241022',
        userId: user?.id,
        contextLevel: 'elite'
      }
    });

    if (error) throw error;
    return data.response;
  };

  const performQualityAssurance = async (content: string, voice: ProfessionalVoice) => {
    // Analyze quality metrics
    const metrics = {
      executiveReadiness: assessExecutiveReadiness(content, voice),
      strategicDepth: assessStrategicDepth(content),
      dataIntegration: assessDataIntegration(content),
      professionalTone: assessProfessionalTone(content, voice),
      actionability: assessActionability(content),
      overallQuality: 0
    };

    metrics.overallQuality = (
      metrics.executiveReadiness +
      metrics.strategicDepth +
      metrics.dataIntegration +
      metrics.professionalTone +
      metrics.actionability
    ) / 5;

    return metrics;
  };

  // Helper functions
  const determineFormalityLevel = (profile: any): 'c-suite' | 'executive' | 'senior' | 'professional' => {
    const level = profile.managementLevel;
    if (level === 'c-suite') return 'c-suite';
    if (level === 'senior') return 'executive';
    if (level === 'mid') return 'senior';
    return 'professional';
  };

  const determineCommStyle = (agentType: string, profile: any): 'direct' | 'consultative' | 'analytical' | 'strategic' => {
    const styleMap = {
      'clipogino': 'strategic',
      'cdv': 'analytical',
      'cir': 'analytical',
      'cia': 'consultative'
    };
    
    return styleMap[agentType as keyof typeof styleMap] || 'consultative';
  };

  const determineAudienceLevel = (profile: any): 'board' | 'executive' | 'management' | 'team' => {
    const level = profile.managementLevel;
    if (level === 'c-suite') return 'board';
    if (level === 'senior') return 'executive';
    if (level === 'mid') return 'management';
    return 'team';
  };

  const determineStructure = (agentType: string, profile: any): 'executive-summary' | 'detailed-analysis' | 'action-plan' | 'presentation' => {
    if (profile.communicationPreferences?.format === 'structured') return 'executive-summary';
    if (agentType === 'cia') return 'action-plan';
    if (agentType === 'cir') return 'detailed-analysis';
    return 'executive-summary';
  };

  const determineLength = (content: string, profile: any): 'brief' | 'standard' | 'comprehensive' | 'extensive' => {
    const preference = profile.communicationPreferences?.detail;
    if (preference === 'high-level') return 'brief';
    if (preference === 'comprehensive') return 'comprehensive';
    return 'standard';
  };

  const determineSections = (agentType: string, structure: string): string[] => {
    const sectionMap = {
      'executive-summary': ['Executive Summary', 'Key Insights', 'Strategic Implications', 'Recommendations'],
      'detailed-analysis': ['Situation Analysis', 'Key Findings', 'Strategic Assessment', 'Risk Analysis', 'Action Plan'],
      'action-plan': ['Current State', 'Recommended Actions', 'Implementation Timeline', 'Success Metrics'],
      'presentation': ['Executive Overview', 'Analysis', 'Insights', 'Next Steps']
    };
    
    return sectionMap[structure as keyof typeof sectionMap] || sectionMap['executive-summary'];
  };

  const shouldIncludeVisuals = (profile: any, agentType: string): boolean => {
    return profile.communicationPreferences?.format === 'structured' || agentType === 'cir';
  };

  const determineDataPresentation = (profile: any, agentType: string): 'narrative' | 'structured' | 'dashboard' => {
    if (agentType === 'cir') return 'dashboard';
    if (profile.communicationPreferences?.format === 'structured') return 'structured';
    return 'narrative';
  };

  const getIndustryVocabulary = (industry: string): string[] => {
    const vocabMap = {
      'technology': ['innovation', 'digital transformation', 'scalability', 'disruption', 'ecosystem'],
      'finance': ['capital allocation', 'risk management', 'portfolio optimization', 'market dynamics'],
      'healthcare': ['clinical outcomes', 'patient-centric', 'regulatory compliance', 'therapeutic areas'],
      'retail': ['customer experience', 'omnichannel', 'supply chain optimization', 'market penetration']
    };
    
    return vocabMap[industry as keyof typeof vocabMap] || vocabMap['technology'];
  };

  const getAgentTone = (agentType: string): string[] => {
    const toneMap = {
      'clipogino': ['strategic', 'visionary', 'authoritative', 'inspiring'],
      'cdv': ['analytical', 'precise', 'investigative', 'thorough'],
      'cir': ['data-driven', 'objective', 'methodical', 'rigorous'],
      'cia': ['consultative', 'strategic', 'insightful', 'decisive']
    };
    
    return toneMap[agentType as keyof typeof toneMap] || toneMap['clipogino'];
  };

  const getStructureTemplate = (structure: string): string => {
    const templates = {
      'executive-summary': `
**EXECUTIVE SUMMARY** (2-3 sentences with key strategic insight)
**KEY STRATEGIC INSIGHTS** (3-5 bullet points with quantified findings)
**STRATEGIC IMPLICATIONS** (Impact analysis with business consequences)
**RECOMMENDATIONS** (Prioritized action items with timelines and success metrics)`,
      
      'detailed-analysis': `
**SITUATION ANALYSIS** (Current state with market context)
**KEY FINDINGS** (Detailed insights with supporting data)
**STRATEGIC ASSESSMENT** (Framework-based analysis)
**RISK ANALYSIS** (Threat assessment with mitigation strategies)
**ACTION PLAN** (Implementation roadmap with success metrics)`,
      
      'action-plan': `
**CURRENT STATE ASSESSMENT** (Baseline with key challenges)
**RECOMMENDED STRATEGIC ACTIONS** (Prioritized initiatives)
**IMPLEMENTATION TIMELINE** (Phased approach with milestones)
**SUCCESS METRICS** (KPIs and measurement framework)`,
      
      'presentation': `
**EXECUTIVE OVERVIEW** (High-level strategic narrative)
**ANALYTICAL INSIGHTS** (Data-driven findings)
**STRATEGIC IMPLICATIONS** (Business impact assessment)
**NEXT STEPS** (Immediate actions and long-term strategy)`
    };
    
    return templates[structure as keyof typeof templates] || templates['executive-summary'];
  };

  // Quality assessment functions
  const assessExecutiveReadiness = (content: string, voice: ProfessionalVoice): number => {
    let score = 0;
    
    // Check for executive language patterns
    const executiveIndicators = ['strategic', 'vision', 'leadership', 'decision', 'growth', 'value'];
    const matches = executiveIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    
    score += Math.min(matches / executiveIndicators.length, 0.4);
    
    // Check formality alignment
    if (voice.formality === 'c-suite' && content.includes('board')) score += 0.3;
    if (content.includes('strategic implications')) score += 0.3;
    
    return Math.min(score, 1.0);
  };

  const assessStrategicDepth = (content: string): number => {
    const strategicKeywords = ['framework', 'analysis', 'competitive', 'market', 'opportunity', 'threat'];
    const matches = strategicKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches / strategicKeywords.length, 1.0);
  };

  const assessDataIntegration = (content: string): number => {
    let score = 0;
    
    // Check for quantitative elements
    if (/\d+%/.test(content)) score += 0.3; // Percentages
    if (/\$[\d,]+/.test(content)) score += 0.3; // Money figures
    if (/\d+\.\d+/.test(content)) score += 0.2; // Decimal numbers
    if (content.includes('source') || content.includes('according to')) score += 0.2;
    
    return Math.min(score, 1.0);
  };

  const assessProfessionalTone = (content: string, voice: ProfessionalVoice): number => {
    let score = 0.5; // Base score
    
    // Check for professional vocabulary
    const professionalWords = ['recommend', 'strategic', 'analysis', 'assessment', 'implementation'];
    const matches = professionalWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    score += Math.min(matches / professionalWords.length * 0.3, 0.3);
    
    // Check for informal language (deduct points)
    const informalWords = ['basically', 'obviously', 'simple', 'easy', 'just'];
    const informalMatches = informalWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    score -= informalMatches * 0.1;
    
    return Math.max(Math.min(score, 1.0), 0);
  };

  const assessActionability = (content: string): number => {
    let score = 0;
    
    // Check for actionable elements
    if (content.includes('recommend')) score += 0.2;
    if (content.includes('next steps')) score += 0.2;
    if (content.includes('action')) score += 0.2;
    if (content.includes('timeline')) score += 0.2;
    if (content.includes('implement')) score += 0.2;
    
    return Math.min(score, 1.0);
  };

  return {
    executeAdvancedStyling,
    isStyling,
    stylingMetrics
  };
}
