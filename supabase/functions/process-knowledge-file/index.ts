
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

    let extractedText = '';

    try {
      // Download the file
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error('Failed to download file');
      }

      const fileBuffer = await fileResponse.arrayBuffer();
      const fileContent = new Uint8Array(fileBuffer);

      // Basic text extraction based on file type
      if (fileType === 'text/plain') {
        extractedText = new TextDecoder().decode(fileContent);
      } else if (fileType === 'application/pdf') {
        // For PDF files, we'll use a simple approach
        // In production, you'd want to use a PDF parsing library
        extractedText = `PDF file content extraction would be implemented here. File: ${fileName}`;
      } else if (fileType.includes('word') || fileType.includes('document')) {
        // For Word documents, we'll use a simple approach
        // In production, you'd want to use a proper document parsing library
        extractedText = `Word document content extraction would be implemented here. File: ${fileName}`;
      } else {
        extractedText = `Unsupported file type: ${fileType}`;
      }

      // Update with extracted content
      await supabase
        .from('user_knowledge_files')
        .update({ 
          content: extractedText,
          extraction_status: 'completed'
        })
        .eq('id', fileId);

      // If OpenAI is available, generate AI summary and insights
      if (openAIApiKey && extractedText.trim().length > 50) {
        try {
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
                  content: 'You are an AI assistant that analyzes knowledge documents. Provide a concise summary and extract 3-5 key insights or takeaways.'
                },
                {
                  role: 'user',
                  content: `Please analyze this document content and provide:\n1. A brief summary (2-3 sentences)\n2. Key insights or takeaways (as bullet points)\n\nContent:\n${extractedText.substring(0, 3000)}`
                }
              ],
              max_tokens: 500,
              temperature: 0.3,
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const aiContent = aiData.choices[0].message.content;
            
            // Parse the AI response to extract summary and key points
            const lines = aiContent.split('\n').filter((line: string) => line.trim());
            let summary = '';
            let keyPoints: string[] = [];
            let isInKeyPoints = false;

            for (const line of lines) {
              if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('overview')) {
                isInKeyPoints = false;
                continue;
              }
              if (line.toLowerCase().includes('key') || line.toLowerCase().includes('insights') || line.toLowerCase().includes('takeaways')) {
                isInKeyPoints = true;
                continue;
              }
              
              if (!isInKeyPoints && !summary && line.trim().length > 20) {
                summary = line.trim();
              } else if (isInKeyPoints && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
                keyPoints.push(line.replace(/^[•\-*]\s*/, '').trim());
              }
            }

            // Update with AI analysis
            await supabase
              .from('user_knowledge_files')
              .update({ 
                ai_summary: summary || aiContent.substring(0, 200),
                ai_key_points: keyPoints.length > 0 ? keyPoints : [aiContent],
                is_ai_processed: true,
                processing_status: 'completed'
              })
              .eq('id', fileId);
          }
        } catch (aiError) {
          console.error('AI processing error:', aiError);
          // Continue without AI processing
        }
      } else {
        // Mark as completed without AI processing
        await supabase
          .from('user_knowledge_files')
          .update({ 
            processing_status: 'completed'
          })
          .eq('id', fileId);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
          hasAI: !!openAIApiKey
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (processingError) {
      console.error('File processing error:', processingError);
      
      // Update status to failed
      await supabase
        .from('user_knowledge_files')
        .update({ 
          processing_status: 'failed',
          extraction_status: 'failed'
        })
        .eq('id', fileId);

      return new Response(
        JSON.stringify({ error: 'File processing failed', details: processingError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
