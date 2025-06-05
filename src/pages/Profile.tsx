
import React from 'react';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function Profile() {
  return (
    <UniversalLayout>
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">
              Build your professional profile to get personalized AI mentoring from CLIPOGINO
            </p>
          </div>
          <UserProfileForm />
        </div>
      </div>
    </UniversalLayout>
  );
}
