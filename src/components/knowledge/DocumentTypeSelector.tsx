
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DocumentType } from '@/hooks/useUserKnowledgeForm';

interface DocumentTypeSelectorProps {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
  disabled?: boolean;
}

export function DocumentTypeSelector({ value, onChange, disabled = false }: DocumentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="documentType">Knowledge Type</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select knowledge type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">Personal Knowledge</SelectItem>
          <SelectItem value="system">System Framework</SelectItem>
          <SelectItem value="template">Template</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Personal knowledge is private to you, while system frameworks can be shared across the platform.
      </p>
    </div>
  );
}
