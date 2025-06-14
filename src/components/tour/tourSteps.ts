
import { TourStep } from '@/contexts/TourContext';

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a LAIGENT! 🚀',
    content: 'Estás a punto de descubrir la plataforma de desarrollo profesional más avanzada con IA. Te guiaremos paso a paso por las funciones principales.',
    target: '[data-tour="welcome-header"]',
    position: 'bottom',
    action: 'none'
  },
  {
    id: 'profile',
    title: 'Tu Perfil Profesional 👤',
    content: 'Completa tu información profesional aquí. Un perfil completo permite que CLIPOGINO te brinde recomendaciones más personalizadas y relevantes.',
    target: '[data-tour="profile-module"]',
    position: 'left',
    action: 'hover'
  },
  {
    id: 'knowledge',
    title: 'Base de Conocimiento 📚',
    content: 'Sube tus documentos profesionales (CV, certificados, portafolios) para que la IA los analice y personalice completamente tu experiencia.',
    target: '[data-tour="knowledge-module"]',
    position: 'top',
    action: 'hover'
  },
  {
    id: 'clipogino',
    title: 'Conoce a CLIPOGINO 🤖',
    content: 'Tu mentor de IA personal. CLIPOGINO puede ayudarte con consejos de carrera, preparación de entrevistas, desarrollo de habilidades y mucho más.',
    target: '[data-tour="chat-module"]',
    position: 'right',
    action: 'hover'
  },
  {
    id: 'intelligence',
    title: 'Inteligencia Competitiva 🎯',
    content: 'Accede a herramientas avanzadas de análisis competitivo con agentes especializados para investigar empresas y oportunidades de mercado.',
    target: '[data-tour="intelligence-module"]',
    position: 'top',
    action: 'hover'
  },
  {
    id: 'content',
    title: 'Generador de Contenido ✨',
    content: 'Crea contenido profesional de alta calidad: posts de LinkedIn, cartas de presentación, propuestas y más, todo con asistencia de IA.',
    target: '[data-tour="content-module"]',
    position: 'bottom',
    action: 'hover'
  },
  {
    id: 'navigation',
    title: 'Navegación Intuitiva 🧭',
    content: 'Usa la barra lateral para navegar entre todas las funciones. Todo está organizado para que encuentres lo que necesitas rápidamente.',
    target: '[data-tour="sidebar"]',
    position: 'right',
    action: 'none'
  },
  {
    id: 'completion',
    title: '¡Listo para Empezar! 🎉',
    content: 'Ya conoces las funciones principales de LAIGENT. Te recomendamos empezar completando tu perfil y subiendo algunos documentos. ¡Disfruta la experiencia!',
    target: '[data-tour="welcome-header"]',
    position: 'bottom',
    action: 'none'
  }
];
