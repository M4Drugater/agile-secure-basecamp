
import { useUserActivityContext } from '../useUserActivityContext';

export function useActivityContext() {
  const { buildActivityContext, activityCount } = useUserActivityContext();

  return {
    buildActivityContext,
    activityCount: activityCount || 0,
  };
}
