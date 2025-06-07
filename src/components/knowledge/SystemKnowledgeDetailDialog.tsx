
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { SystemKnowledgeDocument } from '@/hooks/useSystemKnowledge';

interface SystemKnowledgeDetailDialogProps {
  document: SystemKnowledgeDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const knowledgeTypes = [
  { value: 'framework', label: 'Framework' },
  { value: 'methodology', label: 'Methodology' },
  { value: 'best_practice', label: 'Best Practice' },
  { value: 'template', label: 'Template' },
  { value: 'guideline', label: 'Guideline' },
  { value: 'user_contributed', label: 'User Contributed' },
];

export function SystemKnowledgeDetailDialog({ 
  document, 
  open, 
  onOpenChange 
}: SystemKnowledgeDetailDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <Badge variant="outline">
              {document.source_type === 'user' ? 'Contribución de Usuario' : 
               knowledgeTypes.find(t => t.value === document.knowledge_type)?.label || 'Knowledge'}
            </Badge>
            <Badge variant="secondary">{document.category}</Badge>
          </div>
          <DialogTitle className="text-xl">{document.title}</DialogTitle>
          <DialogDescription>
            Última actualización: {format(new Date(document.updated_at), 'PPP')}
          </DialogDescription>
        </DialogHeader>
        <div className="prose max-w-none mt-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {document.content}
          </div>
        </div>
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t">
            {document.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
