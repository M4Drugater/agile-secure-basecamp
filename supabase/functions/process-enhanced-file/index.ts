
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileId, fileUrl, fileType, fileName } = await req.json();

    if (!fileId || !fileUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to processing
    await supabase
      .from('user_knowledge_files')
      .update({ 
        processing_status: 'processing',
        extraction_status: 'processing'
      })
      .eq('id', fileId);

    let extractedContent = '';
    let processingMetadata = {};

    try {
      // Download the file
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error('Failed to download file');
      }

      const fileBuffer = await fileResponse.arrayBuffer();
      const fileContent = new Uint8Array(fileBuffer);

      // Enhanced text extraction based on file type
      if (fileType === 'text/plain') {
        extractedContent = new TextDecoder().decode(fileContent);
        processingMetadata = { 
          extractionMethod: 'direct_text',
          wordCount: extractedContent.split(' ').length 
        };
      } else if (fileType === 'application/pdf') {
        // Basic PDF processing - in production you'd use a PDF parser
        extractedContent = `PDF Content: ${fileName}\n\nThis PDF file has been uploaded and is ready for processing. Advanced PDF text extraction will be implemented in future versions.`;
        processingMetadata = { 
          extractionMethod: 'pdf_placeholder',
          fileSize: fileContent.length 
        };
      } else if (fileType.includes('word') || fileType.includes('document')) {
        extractedContent = `Document Content: ${fileName}\n\nThis document file has been uploaded and is ready for processing. Advanced document parsing will be implemented in future versions.`;
        processingMetadata = { 
          extractionMethod: 'doc_placeholder',
          fileSize: fileContent.length 
        };
      } else if (fileType.startsWith('image/')) {
        extractedContent = `Image File: ${fileName}\n\nThis image has been uploaded. Image analysis and OCR capabilities will be implemented in future versions.`;
        processingMetadata = { 
          extractionMethod: 'image_placeholder',
          imageType: fileType,
          fileSize: fileContent.length 
        };
      } else {
        extractedContent = `File: ${fileName}\n\nUnsupported file type: ${fileType}. Please use supported formats like PDF, DOC, TXT, or images.`;
        processingMetadata = { 
          extractionMethod: 'unsupported',
          fileType: fileType 
        };
      }

      // Update with extracted content
      await supabase
        .from('user_knowledge_files')
        .update({ 
          extracted_content: extractedContent,
          processing_metadata: processingMetadata,
          extraction_status: 'completed'
        })
        .eq('id', fileId);

      // Enhanced AI analysis if OpenAI is available
      let aiAnalysis = null;
      if (openAIApiKey && extractedContent.trim().length > 50) {
        try {
          console.log('Starting AI analysis for file:', fileName);
          
          const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `You are an expert knowledge analyst. Analyze the provided content and extract:
1. A concise summary (2-3 sentences)
2. Key insights or main points (3-5 bullet points)
3. Relevant tags/keywords (5-8 words)
4. Content type classification
5. Actionable items or next steps (if applicable)

Format your response as JSON with keys: summary, key_points, tags, content_type, action_items`
                },
                {
                  role: 'user',
                  content: `Analyze this content:\n\nTitle: ${fileName}\nContent:\n${extractedContent.substring(0, 4000)}`
                }
              ],
              max_tokens: 800,
              temperature: 0.3,
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const aiContent = aiData.choices[0].message.content;
            
            try {
              // Try to parse as JSON first
              aiAnalysis = JSON.parse(aiContent);
              console.log('Successfully parsed AI analysis as JSON');
            } catch (parseError) {
              console.log('Fallback to text parsing for AI analysis');
              // Fallback to text parsing
              const lines = aiContent.split('\n').filter((line: string) => line.trim());
              let summary = '';
              let keyPoints: string[] = [];
              let tags: string[] = [];
              
              for (const line of lines) {
                const cleanLine = line.trim();
                if (cleanLine.toLowerCase().includes('summary') && !summary) {
                  summary = cleanLine.replace(/^.*summary[:\-]\s*/i, '');
                } else if (cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
                  keyPoints.push(cleanLine.replace(/^[•\-*]\s*/, ''));
                } else if (cleanLine.toLowerCase().includes('tag') || cleanLine.toLowerCase().includes('keyword')) {
                  const tagMatch = cleanLine.match(/(?:tags?|keywords?)[:\-]\s*(.+)/i);
                  if (tagMatch) {
                    tags = tagMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                  }
                }
              }

              aiAnalysis = {
                summary: summary || aiContent.substring(0, 200),
                key_points: keyPoints.length > 0 ? keyPoints : [aiContent.substring(0, 100)],
                tags: tags.length > 0 ? tags : ['analysis'],
                content_type: 'document',
                action_items: []
              };
            }
          } else {
            console.error('AI API request failed:', aiResponse.status, aiResponse.statusText);
          }
        } catch (aiError) {
          console.error('AI processing error:', aiError);
        }
      }

      // Final update with AI analysis
      const finalUpdate: any = {
        processing_status: 'completed',
        is_ai_processed: !!aiAnalysis
      };

      if (aiAnalysis) {
        finalUpdate.ai_analysis = aiAnalysis;
        finalUpdate.ai_summary = aiAnalysis.summary;
        finalUpdate.ai_key_points = aiAnalysis.key_points;
        
        // Update tags if AI provided better ones
        if (aiAnalysis.tags && Array.isArray(aiAnalysis.tags)) {
          finalUpdate.tags = aiAnalysis.tags;
        }
      }

      await supabase
        .from('user_knowledge_files')
        .update(finalUpdate)
        .eq('id', fileId);

      console.log('File processing completed successfully for:', fileName);

      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedContent: extractedContent.substring(0, 500) + (extractedContent.length > 500 ? '...' : ''),
          aiAnalysis: aiAnalysis,
          processingMetadata: processingMetadata,
          hasAI: !!openAIApiKey
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (processingError) {
      console.error('File processing error:', processingError);
      
      // Update status to failed with error details
      await supabase
        .from('user_knowledge_files')
        .update({ 
          processing_status: 'failed',
          extraction_status: 'failed',
          error_details: processingError.message
        })
        .eq('id', fileId);

      return new Response(
        JSON.stringify({ 
          error: 'File processing failed', 
          details: processingError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
