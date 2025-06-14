
import { JourneyStep } from './types';

export const JOURNEY_STEPS: Omit<JourneyStep, 'completed' | 'locked'>[] = [
  {
    id: 'profile',
    title: 'Completa tu Perfil Profesional',
    description: 'Configura tu información personal, industria y objetivos profesionales',
    route: '/profile',
    order: 1
  },
  {
    id: 'knowledge',
    title: 'Sube tus Documentos',
    description: 'Carga CVs, certificados y documentos para personalizar tu experiencia',
    route: '/knowledge',
    order: 2
  },
  {
    id: 'chat',
    title: 'Conoce a CLIPOGINO',
    description: 'Chatea con tu mentor de IA personalizado para desarrollo profesional',
    route: '/chat',
    order: 3
  },
  {
    id: 'agents',
    title: 'Inteligencia Competitiva',
    description: 'Descubre herramientas de análisis competitivo CDV, CIA y CIR',
    route: '/competitive-intelligence',
    order: 4
  },
  {
    id: 'content',
    title: 'Generador de Contenido',
    description: 'Crea contenido profesional con asistencia de IA',
    route: '/content-generator',
    order: 5
  }
];
