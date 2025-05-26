
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { 
  Edit2, 
  Trash2, 
  Eye, 
  Users, 
  TrendingUp,
  Search,
  Plus
} from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { CreateLearningPathForm } from './CreateLearningPathForm';
import { format } from 'date-fns';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPaths?.length || 0}</div>
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
            <div className="text-2xl font-bold">
              {learningPaths?.filter(p => p.is_published).length || 0}
            </div>
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
            <div className="text-2xl font-bold">
              {learningPaths?.reduce((sum, p) => sum + p.enrollment_count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all paths
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search learning paths..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Learning Paths Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Learning Paths</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPaths.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No learning paths found matching your search.' : 'No learning paths created yet.'}
              </p>
              {!searchTerm && (
                <Button 
                  className="mt-4" 
                  onClick={() => setShowCreateForm(true)}
                >
                  Create Your First Learning Path
                </Button>
              )}
            </div>
          ) : (
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
                {filteredPaths.map((path) => (
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
                                onClick={() => handleDelete(path.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Create Learning Path Form */}
      <CreateLearningPathForm 
        open={showCreateForm} 
        onOpenChange={setShowCreateForm} 
      />
    </div>
  );
}
