
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface EnhancedUploadedFileData {
  file_url: string;
  original_file_name: string;
  file_type: string;
  file_size: number;
  extracted_content?: string;
  ai_analysis?: {
    summary?: string;
    key_points?: string[];
    content_type?: string;
    entities?: string[];
  };
}

export function useEnhancedFileUpload() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAndProcessFile = async (file: File): Promise<EnhancedUploadedFileData | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      setUploadProgress(20);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('knowledge-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      setUploadProgress(50);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('knowledge-files')
        .getPublicUrl(fileName);

      setUploadProgress(70);

      // Step 2: Process file with AI
      let processedData: any = {};
      
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke('process-enhanced-file', {
          body: {
            fileUrl: publicUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          },
        });

        if (aiError) {
          console.warn('AI processing failed:', aiError);
          toast({
            title: "Processing Warning",
            description: "File uploaded but AI processing encountered an issue. You can still use the file.",
            variant: "default",
          });
        } else if (aiData) {
          processedData = aiData;
        }
      } catch (aiError) {
        console.warn('AI processing error:', aiError);
        // Continue without AI processing
      }

      setUploadProgress(100);

      const result: EnhancedUploadedFileData = {
        file_url: publicUrl,
        original_file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        extracted_content: processedData.extractedContent,
        ai_analysis: processedData.aiAnalysis,
      };

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded and processed with AI analysis.`,
      });

      return result;

    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (fileUrl: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('knowledge-files')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  };

  return {
    uploadAndProcessFile,
    deleteFile,
    isUploading,
    uploadProgress,
  };
}
