
import { useState } from 'react';
import { UserKnowledgeFile } from './useUserKnowledgeFiles';

export interface KnowledgeFormData {
  title: string;
  description: string;
  content: string;
  tags: string;
}

export function useUserKnowledgeForm() {
  const [formData, setFormData] = useState<KnowledgeFormData>({
    title: '',
    description: '',
    content: '',
    tags: '',
  });
  const [editingFile, setEditingFile] = useState<UserKnowledgeFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<'manual' | 'upload'>('manual');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: '',
    });
    setEditingFile(null);
    setSelectedFile(null);
    setInputMethod('manual');
  };

  const populateForm = (file: UserKnowledgeFile) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      description: file.description || '',
      content: file.content || '',
      tags: file.tags?.join(', ') || '',
    });
    setInputMethod(file.file_url ? 'upload' : 'manual');
  };

  const updateFormField = (field: keyof KnowledgeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    editingFile,
    selectedFile,
    inputMethod,
    setSelectedFile,
    setInputMethod,
    resetForm,
    populateForm,
    updateFormField,
  };
}
