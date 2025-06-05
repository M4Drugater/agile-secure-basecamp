
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { DocumentType } from '@/hooks/useUserKnowledgeForm';

interface DocumentTypeSelectorProps {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
  disabled?: boolean;
}

export function DocumentTypeSelector({ value, onChange, disabled }: DocumentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="document-type">Knowledge Type</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select knowledge type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">
            <div className="flex flex-col">
              <span>Personal Knowledge</span>
              <span className="text-xs text-muted-foreground">
                Private to you, used for personalized responses
              </span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex flex-col">
              <span>System Knowledge</span>
              <span className="text-xs text-muted-foreground">
                Shared frameworks and methodologies
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">
            {value === 'personal' ? 'Personal Knowledge' : 'System Knowledge'}
          </p>
          <p>
            {value === 'personal' 
              ? 'This knowledge is private to you and will be used by CLIPOGINO to provide personalized responses based on your documents, experiences, and context.'
              : 'This knowledge will be shared across the platform as frameworks, methodologies, and best practices that can benefit all users.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
