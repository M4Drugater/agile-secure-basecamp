
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  FileText,
  TrendingUp
} from 'lucide-react';
import { JourneyStep } from './types';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  available: boolean;
  completion?: number;
  isNew?: boolean;
  badge?: string;
  highlight?: boolean;
}

export function useAvailableModules(
  steps: JourneyStep[],
  profileCompleteness: number,
  isJourneyComplete: boolean
) {
  const getAvailableModules = (): ModuleItem[] => {
    const modules: ModuleItem[] = [];
    const completedStepIds = steps.filter(s => s.completed).map(s => s.id);
    
    // Always show profile
    modules.push({
      id: 'profile',
      title: 'Your Profile',
      description: 'Manage your professional information',
      icon: User,
      route: '/profile',
      available: true,
      completion: profileCompleteness,
      isNew: false
    });

    // Show knowledge after profile is started (30% completion)
    if (profileCompleteness >= 30 || completedStepIds.includes('profile')) {
      modules.push({
        id: 'knowledge',
        title: 'Knowledge Base',
        description: 'Upload and manage your documents',
        icon: BookOpen,
        route: '/knowledge',
        available: true,
        isNew: !completedStepIds.includes('knowledge'),
        badge: completedStepIds.includes('profile') && !completedStepIds.includes('knowledge') ? 'Newly Unlocked' : undefined
      });
    }

    // Show chat after knowledge setup or profile completion
    if (completedStepIds.includes('profile') || completedStepIds.includes('knowledge')) {
      modules.push({
        id: 'chat',
        title: 'CLIPOGINO AI Mentor',
        description: 'Chat with your personalized AI assistant',
        icon: MessageSquare,
        route: '/chat',
        available: true,
        badge: 'AI Powered',
        isNew: !completedStepIds.includes('chat'),
        highlight: completedStepIds.includes('knowledge') && !completedStepIds.includes('chat')
      });
    }

    // Show competitive intelligence after first chat
    if (completedStepIds.includes('chat')) {
      modules.push({
        id: 'competitive',
        title: 'Competitive Intelligence',
        description: 'CDV, CIA, and CIR agents for market analysis',
        icon: Shield,
        route: '/competitive-intelligence',
        available: true,
        badge: 'AI Agents',
        isNew: !completedStepIds.includes('agents'),
        highlight: completedStepIds.includes('chat') && !completedStepIds.includes('agents')
      });
    }

    // Show content creation after competitive intelligence discovery
    if (completedStepIds.includes('chat')) {
      modules.push({
        id: 'content',
        title: 'Content Creation',
        description: 'Generate professional content with AI',
        icon: FileText,
        route: '/content-generator',
        available: true,
        isNew: !completedStepIds.includes('content'),
        highlight: completedStepIds.includes('agents') && !completedStepIds.includes('content')
      });
    }

    // Advanced features (available after completing main journey)
    if (isJourneyComplete) {
      modules.push({
        id: 'trends',
        title: 'Trends Discovery',
        description: 'Real-time Reddit trends analysis',
        icon: TrendingUp,
        route: '/trends',
        available: true,
        badge: 'Live Data',
        isNew: true,
        highlight: true
      });
    }

    return modules;
  };

  return { getAvailableModules };
}
