
import React from 'react';
import { UserProfileForm } from '@/components/profile/UserProfileForm';

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Build your professional profile to get personalized AI mentoring from CLIPOGINO
          </p>
        </div>
        <UserProfileForm />
      </div>
    </div>
  );
}
