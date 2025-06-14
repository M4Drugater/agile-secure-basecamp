
import React, { useEffect } from 'react';
import { CompetitiveIntelligenceDashboard } from '@/components/competitive-intelligence/CompetitiveIntelligenceDashboard';
import { UniversalLayout } from '@/components/layout/UniversalLayout';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';

export default function CompetitiveIntelligence() {
  const { completeStep, getJourneySteps } = useProgressiveJourney();

  // Auto-complete the agents step when user visits this page
  useEffect(() => {
    const steps = getJourneySteps();
    const agentsStep = steps.find(step => step.id === 'agents');
    
    if (agentsStep && !agentsStep.completed) {
      console.log('User visited competitive intelligence page, completing agents step');
      completeStep('agents');
    }
  }, [completeStep, getJourneySteps]);

  return (
    <UniversalLayout>
      <CompetitiveIntelligenceDashboard />
    </UniversalLayout>
  );
}
