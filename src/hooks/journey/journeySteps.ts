
import { JourneyStep } from './types';

export const JOURNEY_STEPS: Omit<JourneyStep, 'completed' | 'locked'>[] = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Tell us about yourself to get personalized AI experiences',
    route: '/profile',
    order: 1
  },
  {
    id: 'knowledge',
    title: 'Set Up Knowledge Base',
    description: 'Upload documents and resources for personalized assistance',
    route: '/knowledge',
    order: 2
  },
  {
    id: 'chat',
    title: 'Meet CLIPOGINO',
    description: 'Chat with your AI mentor and get personalized guidance',
    route: '/chat',
    order: 3
  },
  {
    id: 'agents',
    title: 'Explore AI Agents',
    description: 'Discover CDV, CIA, and CIR agents for competitive intelligence',
    route: '/competitive-intelligence',
    order: 4
  },
  {
    id: 'content',
    title: 'Create Content',
    description: 'Generate professional content with AI assistance',
    route: '/content-generator',
    order: 5
  }
];
