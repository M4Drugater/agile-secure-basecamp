
import { useState } from 'react';

export type DocumentType = 'personal' | 'system' | 'template';

interface FormData {
  title: string;
  description: string;
  content: string;
  tags: string;
  metadata?: any;
}

interface EditingFile {
  id: string;
  title: string;
  description?: string;
  content?: string;
  tags?: string[] | string;
  metadata?: any;
}

export function useUserKnowledgeForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    tags: '',
    metadata: {},
  });

  const [editingFile, setEditingFile] = useState<EditingFile | null>(null);
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

  const populateForm = (file: EditingFile) => {
    setEditingFile(file);
    setFormData({
      title: file.title || '',
      description: file.description || '',
      content: file.content || '',
      tags: Array.isArray(file.tags) ? file.tags.join(', ') : (file.tags || ''),
      metadata: file.metadata || {},
    });
    setInputMethod('manual'); // Always use manual for editing
  };

  const updateFormField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    editingFile,
    selectedFile,
    inputMethod,
    documentType,
    setSelectedFile,
    setInputMethod,
    setDocumentType,
    resetForm,
    populateForm,
    updateFormField,
  };
}
