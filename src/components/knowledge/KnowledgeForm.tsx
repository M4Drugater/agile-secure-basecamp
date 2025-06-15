
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType } from '@/types/knowledge';

interface KnowledgeFormData {
  title: string;
  description: string;
  content: string;
  tags: string;
}

interface KnowledgeFormProps {
  formData: KnowledgeFormData;
  documentType: DocumentType;
  onFormDataChange: (field: keyof KnowledgeFormData, value: string) => void;
  onDocumentTypeChange: (type: DocumentType) => void;
  disabled?: boolean;
  showContent?: boolean;
}

export function KnowledgeForm({
  formData,
  documentType,
  onFormDataChange,
  onDocumentTypeChange,
  disabled = false,
  showContent = true
}: KnowledgeFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-type">Document Type</Label>
        <Select
          value={documentType}
          onValueChange={onDocumentTypeChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal Knowledge</SelectItem>
            <SelectItem value="system">System Knowledge</SelectItem>
            <SelectItem value="template">Template</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFormDataChange('title', e.target.value)}
          placeholder="Enter a descriptive title..."
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange('description', e.target.value)}
          placeholder="Brief description of this knowledge item..."
          rows={2}
          disabled={disabled}
        />
      </div>

      {showContent && (
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => onFormDataChange('content', e.target.value)}
            placeholder="Enter your knowledge content here..."
            rows={8}
            disabled={disabled}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => onFormDataChange('tags', e.target.value)}
          placeholder="Enter tags separated by commas..."
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple tags with commas (e.g., "career, development, skills")
        </p>
      </div>
    </div>
  );
}
