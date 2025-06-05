
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedKnowledgeBase } from './useEnhancedKnowledgeBase';
import { toast } from '@/hooks/use-toast';

export interface ProcessingResult {
  success: boolean;
  fileId?: string;
  extractedContent?: string;
  aiAnalysis?: {
    summary?: string;
    keyPoints?: string[];
    category?: string;
    entities?: string[];
    sentiment?: string;
  };
  error?: string;
}

export function useAdvancedFileProcessing() {
  const { user } = useAuth();
  const { queueForProcessing } = useEnhancedKnowledgeBase();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const processFileAdvanced = async (
    file: File,
    options: {
      processingType?: 'full' | 'extract_only' | 'ai_only';
      priority?: number;
      category?: string;
    } = {}
  ): Promise<ProcessingResult> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      setProcessingProgress(20);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('knowledge-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setProcessingProgress(40);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('knowledge-files')
        .getPublicUrl(fileName);

      // Step 2: Create database record
      const { data: fileRecord, error: dbError } = await supabase
        .from('user_knowledge_files')
        .insert({
          user_id: user.id,
          title: file.name.replace(/\.[^/.]+$/, ''),
          file_name: file.name,
          original_file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: publicUrl,
          file_path: fileName,
          document_category: options.category || 'personal',
          source_type: 'upload',
          processing_status: 'pending',
          is_ai_processed: false,
          metadata: {
            uploadedAt: new Date().toISOString(),
            processingOptions: options
          }
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      setProcessingProgress(60);

      // Step 3: Queue for processing if requested
      if (options.processingType !== 'extract_only') {
        queueForProcessing({
          fileId: fileRecord.id,
          fileType: file.type,
          processingType: options.processingType || 'full',
          priority: options.priority || 0
        });
      }

      setProcessingProgress(80);

      // Step 4: Basic content extraction for text files
      let extractedContent = '';
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        try {
          extractedContent = await file.text();
          
          // Update the record with extracted content
          await supabase
            .from('user_knowledge_files')
            .update({
              content: extractedContent,
              extracted_content: extractedContent,
              processing_status: options.processingType === 'extract_only' ? 'completed' : 'pending'
            })
            .eq('id', fileRecord.id);
        } catch (extractError) {
          console.warn('Text extraction failed:', extractError);
        }
      }

      setProcessingProgress(100);

      return {
        success: true,
        fileId: fileRecord.id,
        extractedContent: extractedContent || undefined,
      };

    } catch (error) {
      console.error('Advanced file processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const reprocessFile = async (fileId: string, processingType: 'full' | 'ai_only' = 'full') => {
    try {
      // Get file info
      const { data: fileData, error } = await supabase
        .from('user_knowledge_files')
        .select('file_type')
        .eq('id', fileId)
        .eq('user_id', user?.id)
        .single();

      if (error || !fileData) {
        throw new Error('File not found or access denied');
      }

      // Queue for reprocessing
      queueForProcessing({
        fileId,
        fileType: fileData.file_type || 'unknown',
        processingType,
        priority: 1 // Higher priority for reprocessing
      });

      toast({
        title: "Reprocessing Started",
        description: "Your file has been queued for reprocessing with AI analysis.",
      });

    } catch (error) {
      console.error('Reprocessing error:', error);
      toast({
        title: "Reprocessing Failed",
        description: "Failed to queue file for reprocessing.",
        variant: "destructive",
      });
    }
  };

  return {
    processFileAdvanced,
    reprocessFile,
    isProcessing,
    processingProgress,
  };
}
