
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { LearningPath } from '@/hooks/useLearningPaths';
import { format } from 'date-fns';

interface LearningPathTableProps {
  learningPaths: LearningPath[];
  isDeleting: boolean;
  onDelete: (pathId: string) => void;
  onShowCreateForm: () => void;
}

export function LearningPathTable({ 
  learningPaths, 
  isDeleting, 
  onDelete, 
  onShowCreateForm 
}: LearningPathTableProps) {
  if (learningPaths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Learning Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No learning paths created yet.</p>
            <Button 
              className="mt-4" 
              onClick={onShowCreateForm}
            >
              Create Your First Learning Path
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Learning Paths</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learningPaths.map((path) => (
              <TableRow key={path.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{path.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {path.description?.substring(0, 60)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {path.difficulty_level}
                  </Badge>
                </TableCell>
                <TableCell>{path.estimated_duration_hours}h</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {path.is_published && (
                      <Badge variant="default">Published</Badge>
                    )}
                    {path.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    {!path.is_published && (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{path.enrollment_count}</TableCell>
                <TableCell>
                  {format(new Date(path.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the learning path
                            "{path.title}" and all associated modules and progress data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(path.id)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
