
import { useAuth } from '@/contexts/AuthContext';

export function useUserActivityContext() {
  const { user } = useAuth();

  const buildActivityContext = (): string => {
    if (!user) return '';

    // For now, we'll provide basic activity context
    // This can be enhanced with actual activity tracking later
    const now = new Date();
    const context = `
=== RECENT ACTIVITY ===
User session information:
- Current session: Active
- Last login: Recent
- Platform: LAIGENT Professional Development
- Time zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
- Current time: ${now.toLocaleString()}
`;

    return context;
  };

  return {
    buildActivityContext,
    activityCount: 1, // Basic activity tracking
  };
}
