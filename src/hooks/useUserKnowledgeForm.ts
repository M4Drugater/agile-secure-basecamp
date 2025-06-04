
import { useState } from 'react';
import { UserKnowledgeFile } from './useUserKnowledgeFiles';

export interface KnowledgeFormData {
  title: string;
  description: string;
  content: string;
  tags: string;
  metadata?: any;
}

export type DocumentType = 'personal' | 'system' | 'resource';

export function useUserKnowledgeForm() {
  const [formData, setFormData] = useState<KnowledgeFormData>({
    title: '',
    description: '',
    content: '',
    tags: '',
    metadata: {},
  });
  const [editingFile, setEditingFile] = useState<UserKnowledgeFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<'manual' | 'upload'>('manual');
  const [documentType, setDocumentType] = useState<DocumentType>('personal');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: '',
      metadata: {},
    });
    setEditingFile(null);
    setSelectedFile(null);
    setInputMethod('manual');
    setDocumentType('personal');
  };

  const populateForm = (file: UserKnowledgeFile) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      description: file.description || '',
      content: file.content || '',
      tags: file.tags?.join(', ') || '',
      metadata: file.metadata || {},
    });
    setInputMethod(file.file_url ? 'upload' : 'manual');
  };

  const updateFormField = (field: keyof KnowledgeFormData, value: string | any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setDocumentTypeForContext = (type: DocumentType) => {
    setDocumentType(type);
  };

  return {
    formData,
    editingFile,
    selectedFile,
    inputMethod,
    documentType,
    setSelectedFile,
    setInputMethod,
    setDocumentType: setDocumentTypeForContext,
    resetForm,
    populateForm,
    updateFormField,
  };
}
