
import { JourneyStep } from './types';

export const JOURNEY_STEPS: Omit<JourneyStep, 'completed' | 'locked'>[] = [
  {
    id: 'profile',
    title: 'Completa tu Perfil Profesional (80%)',
    description: 'Configura tu información personal, industria y objetivos profesionales - Obligatorio',
    route: '/profile',
    order: 1
  },
  {
    id: 'knowledge',
    title: 'Sube tus Documentos',
    description: 'Carga al menos un documento (CV, certificado, etc.) - Obligatorio',
    route: '/knowledge',
    order: 2
  },
  {
    id: 'chat',
    title: 'Conoce a CLIPOGINO',
    description: 'Visita el chat con tu mentor de IA personalizado - Se completa automáticamente',
    route: '/chat',
    order: 3
  },
  {
    id: 'agents',
    title: 'Inteligencia Competitiva',
    description: 'Explora herramientas de análisis competitivo - Se completa automáticamente',
    route: '/competitive-intelligence',
    order: 4
  },
  {
    id: 'content',
    title: 'Generador de Contenido',
    description: 'Descubre la creación de contenido con IA - Se completa automáticamente',
    route: '/content-generator',
    order: 5
  }
];
