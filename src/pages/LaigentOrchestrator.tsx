
import React, { useState } from 'react';
import { LaigentBucketSelector } from '@/components/orchestrators/LaigentBucketSelector';
import { LaigentWorkflowInterface } from '@/components/orchestrators/LaigentWorkflowInterface';

export default function LaigentOrchestrator() {
  const [selectedBucket, setSelectedBucket] = useState<any>(null);

  const handleSelectBucket = (bucket: any) => {
    setSelectedBucket(bucket);
  };

  const handleBackToBuckets = () => {
    setSelectedBucket(null);
  };

  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      {!selectedBucket ? (
        <LaigentBucketSelector onSelectBucket={handleSelectBucket} />
      ) : (
        <LaigentWorkflowInterface 
          selectedBucket={selectedBucket}
          onBack={handleBackToBuckets}
        />
      )}
    </div>
  );
}
