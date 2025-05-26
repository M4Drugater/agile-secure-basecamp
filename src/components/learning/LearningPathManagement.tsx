
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { CreateLearningPathForm } from './CreateLearningPathForm';
import { LearningPathStats } from './LearningPathStats';
import { LearningPathSearch } from './LearningPathSearch';
import { LearningPathTable } from './LearningPathTable';

export function LearningPathManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { learningPaths, isLoading, deletePath, isDeleting } = useLearningPaths();

  const filteredPaths = learningPaths?.filter(path => 
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (pathId: string) => {
    deletePath(pathId);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Learning Path Management</h2>
          <p className="text-muted-foreground">
            Create and manage learning paths for your organization
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Path
        </Button>
      </div>

      {/* Stats Cards */}
      <LearningPathStats learningPaths={learningPaths || []} />

      {/* Search */}
      <LearningPathSearch 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />

      {/* Learning Paths Table */}
      <LearningPathTable
        learningPaths={searchTerm ? filteredPaths : learningPaths || []}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onShowCreateForm={() => setShowCreateForm(true)}
      />

      {/* Create Learning Path Form */}
      <CreateLearningPathForm 
        open={showCreateForm} 
        onOpenChange={setShowCreateForm} 
      />
    </div>
  );
}
