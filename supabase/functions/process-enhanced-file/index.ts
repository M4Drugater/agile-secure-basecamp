
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

    console.log('Process Enhanced File Request:', { fileId, fileUrl, fileType, fileName });

    if (!fileId || !fileUrl) {
      console.error('Missing required parameters:', { fileId, fileUrl });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: fileId and fileUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the file record exists
    const { data: fileRecord, error: fetchError } = await supabase
      .from('user_knowledge_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileRecord) {
      console.error('File record not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'File record not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found file record:', fileRecord.title);

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
      console.log('Starting content extraction for:', fileName);
      
      // Download the file for processing
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
      }

      const fileBuffer = await fileResponse.arrayBuffer();
      const fileContent = new Uint8Array(fileBuffer);

      // Enhanced text extraction based on file type
      if (fileType === 'text/plain') {
        extractedContent = new TextDecoder().decode(fileContent);
        processingMetadata = { 
          extractionMethod: 'direct_text',
          wordCount: extractedContent.split(' ').length,
          characterCount: extractedContent.length
        };
        console.log('Extracted text content:', extractedContent.length, 'characters');
      } else if (fileType === 'application/pdf') {
        extractedContent = `PDF Document: ${fileName}\n\nThis PDF file has been uploaded successfully. The document contains ${Math.floor(fileContent.length / 1000)}KB of data and is ready for processing.\n\nNote: Advanced PDF text extraction will be implemented in future versions. For now, you can manually add key content in the description or content fields.`;
        processingMetadata = { 
          extractionMethod: 'pdf_placeholder',
          fileSize: fileContent.length,
          estimatedPages: Math.max(1, Math.floor(fileContent.length / 50000))
        };
        console.log('PDF processing completed with placeholder');
      } else if (fileType.includes('word') || fileType.includes('document')) {
        extractedContent = `Word Document: ${fileName}\n\nThis document file has been uploaded successfully. The file contains ${Math.floor(fileContent.length / 1000)}KB of content and is ready for processing.\n\nNote: Advanced document parsing will be implemented in future versions. For now, you can manually add key content in the description or content fields.`;
        processingMetadata = { 
          extractionMethod: 'doc_placeholder',
          fileSize: fileContent.length,
          documentType: fileType
        };
        console.log('Document processing completed with placeholder');
      } else if (fileType.startsWith('image/')) {
        extractedContent = `Image File: ${fileName}\n\nThis image has been uploaded successfully. The image file is ${Math.floor(fileContent.length / 1000)}KB in size.\n\nNote: Image analysis and OCR capabilities will be implemented in future versions. You can add descriptions and key insights manually.`;
        processingMetadata = { 
          extractionMethod: 'image_placeholder',
          imageType: fileType,
          fileSize: fileContent.length 
        };
        console.log('Image processing completed with placeholder');
      } else if (fileType === 'application/json') {
        const jsonContent = new TextDecoder().decode(fileContent);
        try {
          const parsedJson = JSON.parse(jsonContent);
          extractedContent = `JSON Data: ${fileName}\n\nStructured data with ${Object.keys(parsedJson).length} top-level properties.\n\nContent:\n${JSON.stringify(parsedJson, null, 2)}`;
          processingMetadata = { 
            extractionMethod: 'json_parsed',
            dataStructure: typeof parsedJson,
            topLevelKeys: Array.isArray(parsedJson) ? parsedJson.length : Object.keys(parsedJson).length
          };
          console.log('JSON processing completed');
        } catch (jsonError) {
          extractedContent = jsonContent;
          processingMetadata = { extractionMethod: 'json_raw', parseError: true };
        }
      } else {
        extractedContent = `File: ${fileName}\n\nFile type: ${fileType}\nSize: ${Math.floor(fileContent.length / 1000)}KB\n\nThis file format is not yet supported for automatic content extraction. You can manually add key information in the description and content fields.`;
        processingMetadata = { 
          extractionMethod: 'unsupported',
          fileType: fileType,
          fileSize: fileContent.length
        };
        console.log('Unsupported file type processed with metadata');
      }

      // Update with extracted content
      await supabase
        .from('user_knowledge_files')
        .update({ 
          extracted_content: extractedContent,
          content: extractedContent, // Also populate the main content field
          processing_metadata: processingMetadata,
          extraction_status: 'completed'
        })
        .eq('id', fileId);

      console.log('Content extraction completed, starting AI analysis');

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
                  content: `You are an expert knowledge analyst. Analyze the provided content and extract valuable insights. Respond with a JSON object containing:
{
  "summary": "A concise 2-3 sentence summary",
  "key_points": ["Array of 3-5 main insights or takeaways"],
  "tags": ["Array of 5-8 relevant keywords/tags"],
  "content_type": "Classification of content type",
  "action_items": ["Array of actionable next steps if applicable"],
  "entities": ["Array of important people, places, concepts mentioned"]
}`
                },
                {
                  role: 'user',
                  content: `Analyze this content from file "${fileName}":\n\n${extractedContent.substring(0, 4000)}`
                }
              ],
              max_tokens: 1000,
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
              console.log('AI response not valid JSON, parsing as text');
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
                tags: tags.length > 0 ? tags : ['document', 'analysis'],
                content_type: 'document',
                action_items: [],
                entities: []
              };
            }
          } else {
            console.error('AI API request failed:', aiResponse.status, aiResponse.statusText);
          }
        } catch (aiError) {
          console.error('AI processing error:', aiError);
        }
      } else {
        console.log('Skipping AI analysis: insufficient content or missing API key');
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

        // Update description if not set and AI provided summary
        if (!fileRecord.description && aiAnalysis.summary) {
          finalUpdate.description = aiAnalysis.summary;
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
          hasAI: !!openAIApiKey,
          message: `Successfully processed ${fileName}${aiAnalysis ? ' with AI analysis' : ''}`
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
