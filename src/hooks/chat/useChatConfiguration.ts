
import { Zap, Brain, Activity } from 'lucide-react';

export interface ChatInterfaceConfig {
  title?: string;
  subtitle?: string;
  enableEnhancedContext?: boolean;
  enableFileAttachments?: boolean;
  enableKnowledgeRecommendations?: boolean;
  showContextStatus?: boolean;
  currentPage?: string;
  customBadges?: Array<{
    label: string;
    variant: 'default' | 'secondary' | 'outline';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export interface ChatConfigurationPreset {
  id: string;
  name: string;
  description: string;
  config: ChatInterfaceConfig;
}

export function useChatConfiguration() {
  const presets: ChatConfigurationPreset[] = [
    {
      id: 'basic',
      name: 'Basic Chat',
      description: 'Simple AI chat without advanced features',
      config: {
        title: 'AI Chat with CLIPOGINO',
        subtitle: 'Professional development assistance',
        enableEnhancedContext: false,
        enableFileAttachments: false,
        enableKnowledgeRecommendations: false,
        showContextStatus: false,
        currentPage: '/chat',
      }
    },
    {
      id: 'enhanced',
      name: 'Enhanced Chat',
      description: 'AI chat with enhanced context and features',
      config: {
        title: 'Enhanced AI Chat with CLIPOGINO',
        subtitle: 'Advanced AI assistant for professional development',
        enableEnhancedContext: true,
        enableFileAttachments: true,
        enableKnowledgeRecommendations: true,
        showContextStatus: true,
        currentPage: '/enhanced-chat',
        customBadges: [
          {
            label: 'Enhanced v2.0',
            variant: 'outline' as const,
            icon: Zap,
          }
        ],
      }
    },
    {
      id: 'consolidated',
      name: 'Consolidated Chat',
      description: 'All-in-one chat with comprehensive features',
      config: {
        title: 'Consolidated AI Chat',
        subtitle: 'Optimized AI assistant for professional development',
        enableEnhancedContext: true,
        enableFileAttachments: true,
        enableKnowledgeRecommendations: true,
        showContextStatus: true,
        currentPage: '/chat',
        customBadges: [
          {
            label: 'Optimized v2.0',
            variant: 'outline' as const,
            icon: Zap,
          }
        ],
      }
    },
    {
      id: 'elite',
      name: 'Elite Chat',
      description: 'Premium chat experience with all features',
      config: {
        title: 'Elite AI Chat with CLIPOGINO',
        subtitle: 'Executive-level AI guidance and strategic insights',
        enableEnhancedContext: true,
        enableFileAttachments: true,
        enableKnowledgeRecommendations: true,
        showContextStatus: true,
        currentPage: '/enhanced-features',
        customBadges: [
          {
            label: 'Elite',
            variant: 'default' as const,
            icon: Brain,
          },
          {
            label: 'Strategic AI',
            variant: 'secondary' as const,
            icon: Activity,
          }
        ],
      }
    }
  ];

  const getPreset = (id: string): ChatConfigurationPreset | undefined => {
    return presets.find(preset => preset.id === id);
  };

  const createCustomConfig = (overrides: Partial<ChatInterfaceConfig>): ChatInterfaceConfig => {
    const baseConfig = getPreset('basic')!.config;
    return { ...baseConfig, ...overrides };
  };

  return {
    presets,
    getPreset,
    createCustomConfig,
  };
}
