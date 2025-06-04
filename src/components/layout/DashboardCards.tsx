
import React from 'react';
import { UserProfileCard } from './cards/UserProfileCard';
import { ProfileCompletionCard } from './cards/ProfileCompletionCard';
import { QuickAccessCard } from './cards/QuickAccessCard';
import { SystemStatusCard } from './cards/SystemStatusCard';
import { SecurityStatusCard } from './cards/SecurityStatusCard';
import { DevelopmentProgressCard } from './cards/DevelopmentProgressCard';
import { KnowledgeBaseCard } from './cards/KnowledgeBaseCard';
import { ContentCreationCard } from './cards/ContentCreationCard';
import { LearningManagementCard } from './cards/LearningManagementCard';
import { AdminPanelCard } from './cards/AdminPanelCard';
import { useSimplifiedAuthContext } from '@/contexts/SimplifiedAuthContext';

export function DashboardCards() {
  const { hasRole } = useSimplifiedAuthContext();
  const isAdmin = hasRole('admin');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Row 1: Core User Features */}
      <UserProfileCard />
      <ProfileCompletionCard />
      <QuickAccessCard />
      
      {/* Row 2: System & Security */}
      <SystemStatusCard />
      <SecurityStatusCard />
      <DevelopmentProgressCard isAdmin={isAdmin} />
      
      {/* Row 3: Content & Knowledge */}
      <KnowledgeBaseCard />
      <ContentCreationCard />
      <LearningManagementCard />
      
      {/* Admin-only card */}
      {isAdmin && <AdminPanelCard />}
    </div>
  );
}
