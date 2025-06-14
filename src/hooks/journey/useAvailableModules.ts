
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  FileText
} from 'lucide-react';
import { JourneyStep } from './types';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  available: boolean;
  completed: boolean;
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
    
    console.log('Available modules calculation:', {
      completedStepIds,
      profileCompleteness,
      isJourneyComplete,
      stepsDetails: steps.map(s => ({ id: s.id, completed: s.completed, title: s.title }))
    });
    
    // Perfil - siempre disponible
    modules.push({
      id: 'profile',
      title: 'Tu Perfil',
      description: 'Gestiona tu información profesional y objetivos',
      icon: User,
      route: '/profile',
      available: true,
      completed: completedStepIds.includes('profile'),
      completion: profileCompleteness,
      isNew: false
    });

    // Base de conocimiento - SOLO disponible después de completar el perfil
    if (completedStepIds.includes('profile')) {
      modules.push({
        id: 'knowledge',
        title: 'Base de Conocimiento',
        description: 'Sube y gestiona tus documentos profesionales',
        icon: BookOpen,
        route: '/knowledge',
        available: true,
        completed: completedStepIds.includes('knowledge'),
        isNew: !completedStepIds.includes('knowledge'),
        badge: !completedStepIds.includes('knowledge') ? 'Nuevo' : undefined,
        highlight: !completedStepIds.includes('knowledge')
      });
    }

    // CLIPOGINO - SOLO disponible después de subir al menos un documento
    if (completedStepIds.includes('knowledge')) {
      modules.push({
        id: 'chat',
        title: 'CLIPOGINO',
        description: 'Tu mentor de IA personalizado para desarrollo profesional',
        icon: MessageSquare,
        route: '/chat',
        available: true,
        completed: completedStepIds.includes('chat'),
        badge: 'IA',
        isNew: !completedStepIds.includes('chat'),
        highlight: !completedStepIds.includes('chat')
      });
    }

    // Módulos avanzados - SOLO después de usar CLIPOGINO al menos una vez
    if (completedStepIds.includes('chat')) {
      // Inteligencia competitiva
      modules.push({
        id: 'competitive',
        title: 'Inteligencia Competitiva',
        description: 'Análisis de mercado con agentes CDV, CIA y CIR',
        icon: Shield,
        route: '/competitive-intelligence',
        available: true,
        completed: completedStepIds.includes('agents'),
        badge: 'Agentes IA',
        isNew: !completedStepIds.includes('agents'),
        highlight: !completedStepIds.includes('agents')
      });

      // Generador de contenido
      modules.push({
        id: 'content',
        title: 'Generador de Contenido',
        description: 'Crea contenido profesional con asistencia de IA',
        icon: FileText,
        route: '/content-generator',
        available: true,
        completed: completedStepIds.includes('content'),
        badge: 'IA',
        isNew: !completedStepIds.includes('content'),
        highlight: !completedStepIds.includes('content')
      });
    }

    return modules;
  };

  return { getAvailableModules };
}
