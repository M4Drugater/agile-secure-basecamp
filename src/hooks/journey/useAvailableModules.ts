
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
      isJourneyComplete
    });
    
    // Perfil - siempre disponible
    modules.push({
      id: 'profile',
      title: 'Tu Perfil',
      description: 'Gestiona tu información profesional y objetivos',
      icon: User,
      route: '/profile',
      available: true,
      completion: profileCompleteness,
      isNew: false
    });

    // Base de conocimiento - disponible después de completar el perfil
    if (completedStepIds.includes('profile')) {
      modules.push({
        id: 'knowledge',
        title: 'Base de Conocimiento',
        description: 'Sube y gestiona tus documentos profesionales',
        icon: BookOpen,
        route: '/knowledge',
        available: true,
        isNew: !completedStepIds.includes('knowledge'),
        badge: !completedStepIds.includes('knowledge') ? 'Nuevo' : undefined,
        highlight: !completedStepIds.includes('knowledge')
      });
    }

    // Solo mostrar módulos avanzados si el journey está completo o muy avanzado
    if (isJourneyComplete || completedStepIds.length >= 3) {
      // CLIPOGINO - disponible después de subir documentos
      if (completedStepIds.includes('knowledge')) {
        modules.push({
          id: 'chat',
          title: 'CLIPOGINO',
          description: 'Tu mentor de IA personalizado para desarrollo profesional',
          icon: MessageSquare,
          route: '/chat',
          available: true,
          badge: 'IA',
          isNew: !completedStepIds.includes('chat'),
          highlight: !completedStepIds.includes('chat')
        });
      }

      // Inteligencia competitiva - después del primer chat
      if (completedStepIds.includes('chat')) {
        modules.push({
          id: 'competitive',
          title: 'Inteligencia Competitiva',
          description: 'Análisis de mercado con agentes CDV, CIA y CIR',
          icon: Shield,
          route: '/competitive-intelligence',
          available: true,
          badge: 'Agentes IA',
          isNew: !completedStepIds.includes('agents'),
          highlight: !completedStepIds.includes('agents')
        });
      }

      // Generador de contenido - después de usar chat
      if (completedStepIds.includes('chat')) {
        modules.push({
          id: 'content',
          title: 'Generador de Contenido',
          description: 'Crea contenido profesional con asistencia de IA',
          icon: FileText,
          route: '/content-generator',
          available: true,
          badge: 'IA',
          isNew: !completedStepIds.includes('content'),
          highlight: !completedStepIds.includes('content')
        });
      }
    }

    return modules;
  };

  return { getAvailableModules };
}
