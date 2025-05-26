
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Sparkles } from 'lucide-react';

interface ContentLibraryEmptyStateProps {
  hasContentItems: boolean;
  onCreateContent: () => void;
}

export function ContentLibraryEmptyState({ hasContentItems, onCreateContent }: ContentLibraryEmptyStateProps) {
  return (
    <Card className="card-enhanced text-center py-16 animate-fade-in">
      <CardContent>
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            {!hasContentItems ? (
              <>
                <h3 className="text-2xl font-heading font-bold text-foreground">Start Your Content Journey</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create your first piece of professional content with AI assistance. 
                  Build resumes, cover letters, LinkedIn posts, and more.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-heading font-bold text-foreground">No Matching Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We couldn't find any content matching your search criteria. 
                  Try adjusting your filters or create new content.
                </p>
              </>
            )}
          </div>
          
          {!hasContentItems && (
            <Button 
              onClick={onCreateContent}
              className="btn-enhanced bg-gradient-primary hover:shadow-strong hover-lift"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Content
              <Sparkles className="h-4 w-4 ml-2 opacity-70" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
