
import React from 'react';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function Profile() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Build your professional profile to get personalized AI mentoring from CLIPOGINO
          </p>
        </div>
        <UserProfileForm />
      </div>
    </UnifiedAppLayout>
  );
}
