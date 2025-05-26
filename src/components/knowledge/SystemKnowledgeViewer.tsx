
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSystemKnowledge } from '@/hooks/useSystemKnowledge';
import { Search, Eye, BookOpen, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export function SystemKnowledgeViewer() {
  const { documents, isLoading } = useSystemKnowledge();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewingDocument, setViewingDocument] = useState<any>(null);

  const categories = ['Leadership', 'Strategy', 'Communication', 'Project Management', 'Career Development'];
  const knowledgeTypes = [
    { value: 'framework', label: 'Framework' },
    { value: 'methodology', label: 'Methodology' },
    { value: 'best_practice', label: 'Best Practice' },
    { value: 'template', label: 'Template' },
    { value: 'guideline', label: 'Guideline' },
  ];

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.knowledge_type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  }) || [];

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600';
    if (priority >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading system knowledge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search frameworks, methodologies, best practices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {knowledgeTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      {knowledgeTypes.find(t => t.value === document.knowledge_type)?.label}
                    </Badge>
                    {document.priority >= 8 && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {document.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {document.subcategory || document.category}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <span className={`font-medium ${getPriorityColor(document.priority)}`}>
                    {document.priority}/10
                  </span>
                </div>
                
                {document.usage_count > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Used {document.usage_count} times</span>
                  </div>
                )}

                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setViewingDocument(document)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No knowledge found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'System knowledge will appear here when available'
              }
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        {viewingDocument && (
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <Badge variant="outline">
                  {knowledgeTypes.find(t => t.value === viewingDocument.knowledge_type)?.label}
                </Badge>
                <Badge variant="secondary">{viewingDocument.category}</Badge>
              </div>
              <DialogTitle className="text-xl">{viewingDocument.title}</DialogTitle>
              <DialogDescription>
                Last updated {format(new Date(viewingDocument.updated_at), 'PPP')}
              </DialogDescription>
            </DialogHeader>
            <div className="prose max-w-none mt-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {viewingDocument.content}
              </div>
            </div>
            {viewingDocument.tags && viewingDocument.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t">
                {viewingDocument.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
