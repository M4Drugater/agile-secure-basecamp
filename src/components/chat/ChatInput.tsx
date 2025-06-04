
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Paperclip, X, FileText, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useEnhancedFileUpload } from '@/hooks/useEnhancedFileUpload';

interface AttachedFile {
  file: File;
  uploadData?: any;
  isProcessing?: boolean;
}

interface ChatInputProps {
  onSendMessage: (message: string, attachedFiles?: AttachedFile[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const { isLoading: costLoading } = useCostMonitoring();
  const { uploadAndProcessFile, isUploading } = useEnhancedFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if ((!input.trim() && attachedFiles.length === 0) || isLoading || costLoading) return;
    
    onSendMessage(input, attachedFiles);
    setInput('');
    setAttachedFiles([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Add file to attached files with processing state
    const newAttachedFile: AttachedFile = {
      file,
      isProcessing: true,
    };
    
    setAttachedFiles(prev => [...prev, newAttachedFile]);

    try {
      // Process the file
      const uploadData = await uploadAndProcessFile(file);
      
      // Update the attached file with upload data
      setAttachedFiles(prev => 
        prev.map(af => 
          af.file === file 
            ? { ...af, uploadData, isProcessing: false }
            : af
        )
      );
    } catch (error) {
      console.error('Error processing attached file:', error);
      // Remove file from attachments if processing failed
      setAttachedFiles(prev => prev.filter(af => af.file !== file));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachedFile = (fileToRemove: File) => {
    setAttachedFiles(prev => prev.filter(af => af.file !== fileToRemove));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-3 w-3" />;
    }
    return <FileText className="h-3 w-3" />;
  };

  const isDisabled = isLoading || costLoading || isUploading || attachedFiles.some(af => af.isProcessing);

  return (
    <div className="space-y-2">
      {/* Attached Files Display */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg">
          {attachedFiles.map((attachedFile, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center gap-1 px-2 py-1"
            >
              {getFileIcon(attachedFile.file)}
              <span className="text-xs max-w-32 truncate">
                {attachedFile.file.name}
              </span>
              {attachedFile.isProcessing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeAttachedFile(attachedFile.file)}
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFileAttach}
          disabled={isDisabled}
          className="self-end"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask CLIPOGINO about your career development... (You can also attach files)"
          className="flex-1 min-h-[60px]"
          disabled={isDisabled}
        />
        
        <Button
          onClick={handleSendMessage}
          disabled={(!input.trim() && attachedFiles.length === 0) || isDisabled}
          size="lg"
          className="self-end"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
