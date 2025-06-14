
import { useState } from 'react';

export function useMockContextBuilders() {
  const [contentCount, setContentCount] = useState(3);
  const [learningCount, setLearningCount] = useState(2);
  const [activityCount, setActivityCount] = useState(5);
  const [conversationCount, setConversationCount] = useState(3);

  const buildContentContext = (): string => {
    // Simplified content context - would connect to actual content data
    setContentCount(3); // Mock data
    return `\n=== CONTENT CREATION CONTEXT ===\nRecent content types: Blog posts, Social media, Marketing copy\n`;
  };

  const buildLearningContext = (): string => {
    // Simplified learning context - would connect to actual learning data
    setLearningCount(2); // Mock data
    return `\n=== LEARNING CONTEXT ===\nActive learning paths: Professional Development, AI Skills\n`;
  };

  const buildActivityContext = (): string => {
    // Simplified activity context - would connect to actual activity data
    setActivityCount(5); // Mock data
    return `\n=== USER ACTIVITY CONTEXT ===\nRecent activities: Chat sessions, Content generation, Knowledge uploads\n`;
  };

  const buildConversationContext = (): string => {
    // Simplified conversation context - would connect to actual conversation data
    setConversationCount(3); // Mock data
    return `\n=== CONVERSATION CONTEXT ===\nRecent topics: Professional development, Content strategy, Learning goals\n`;
  };

  return {
    buildContentContext,
    buildLearningContext,
    buildActivityContext,
    buildConversationContext,
    contentCount,
    learningCount,
    activityCount,
    conversationCount,
  };
}
