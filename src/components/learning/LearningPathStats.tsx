
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, TrendingUp } from 'lucide-react';
import { LearningPath } from '@/hooks/useLearningPaths';

interface LearningPathStatsProps {
  learningPaths: LearningPath[];
}

export function LearningPathStats({ learningPaths }: LearningPathStatsProps) {
  const totalPaths = learningPaths?.length || 0;
  const publishedPaths = learningPaths?.filter(p => p.is_published).length || 0;
  const totalEnrollments = learningPaths?.reduce((sum, p) => sum + p.enrollment_count, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPaths}</div>
          <p className="text-xs text-muted-foreground">
            Learning paths created
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publishedPaths}</div>
          <p className="text-xs text-muted-foreground">
            Visible to users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEnrollments}</div>
          <p className="text-xs text-muted-foreground">
            Across all paths
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
