
import { useProfileContextBuilder } from '../useProfileContextBuilder';

export function useProfileContext() {
  const { buildProfileContextString, hasProfileContext } = useProfileContextBuilder();

  return {
    buildProfileContext: buildProfileContextString,
    hasProfileContext: hasProfileContext || false,
  };
}
