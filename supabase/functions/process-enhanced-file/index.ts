
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileProcessingRequest {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface AIAnalysis {
  summary?: string;
  key_points?: string[];
  content_type?: string;
  entities?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, fileName, fileType, fileSize }: FileProcessingRequest = await req.json();

    if (!fileUrl || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing file:', { fileName, fileType, fileSize, fileUrl });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.warn('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          extractedContent: `File: ${fileName} (AI processing not available - OpenAI API key not configured)`,
          aiAnalysis: {
            summary: `File uploaded: ${fileName}`,
            key_points: ['File uploaded successfully', 'AI processing unavailable'],
            content_type: fileType.startsWith('image/') ? 'image' : 'document',
            entities: []
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let extractedContent = '';
    let aiAnalysis: AIAnalysis | null = null;

    try {
      // For images, we can process them directly with Vision API without downloading
      if (fileType.startsWith('image/')) {
        console.log('Processing image with Vision API using URL:', fileUrl);
        
        const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Analyze this image thoroughly. Extract any visible text content, describe what you see including diagrams, charts, or visual elements, and identify key insights that could be useful for professional development or knowledge management. Be detailed and comprehensive.'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: fileUrl
                    }
                  }
                ]
              }
            ],
            max_tokens: 1500,
          }),
        });

        if (visionResponse.ok) {
          const visionData = await visionResponse.json();
          extractedContent = visionData.choices[0].message.content;
          
          // Generate structured analysis
          const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                  content: 'Extract key information from this image analysis. Provide: 1) A concise summary (1-2 sentences), 2) Key points as bullet points, 3) Content type classification, 4) Important entities or concepts mentioned. Format your response as: SUMMARY: [summary]\nKEY POINTS:\n- [point 1]\n- [point 2]\nCONTENT TYPE: [type]\nENTITIES: [entity1, entity2]'
                },
                {
                  role: 'user',
                  content: `Image analysis: ${extractedContent}`
                }
              ],
              max_tokens: 500,
            }),
          });

          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            const analysis = analysisData.choices[0].message.content;
            
            // Parse structured response
            const summaryMatch = analysis.match(/SUMMARY:\s*([^\n]+)/);
            const keyPointsMatch = analysis.match(/KEY POINTS:\n((?:- [^\n]+\n?)+)/);
            const contentTypeMatch = analysis.match(/CONTENT TYPE:\s*([^\n]+)/);
            const entitiesMatch = analysis.match(/ENTITIES:\s*([^\n]+)/);
            
            aiAnalysis = {
              summary: summaryMatch ? summaryMatch[1].trim() : 'Image analysis completed',
              key_points: keyPointsMatch ? keyPointsMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(point => point.replace(/^-\s*/, '').trim()) : ['Image content analyzed'],
              content_type: contentTypeMatch ? contentTypeMatch[1].trim() : 'image',
              entities: entitiesMatch ? entitiesMatch[1].split(',').map(e => e.trim()) : []
            };
          }
        } else {
          const errorData = await visionResponse.text();
          console.error('Vision API error:', errorData);
          extractedContent = `Image: ${fileName}\n\nVision API processing failed. Image uploaded successfully and can be referenced in conversations.`;
          aiAnalysis = {
            summary: `Image uploaded: ${fileName}`,
            key_points: ['Image uploaded successfully', 'Vision processing failed'],
            content_type: 'image',
            entities: []
          };
        }
      } else {
        // For other file types, try to download and process
        console.log('Attempting to download file:', fileUrl);
        
        const fileResponse = await fetch(fileUrl, {
          headers: {
            'User-Agent': 'Supabase-Edge-Function'
          }
        });

        if (!fileResponse.ok) {
          console.error('Failed to download file:', fileResponse.status, fileResponse.statusText);
          // Even if download fails, we can still provide basic info
          extractedContent = `Document: ${fileName}\n\nFile type: ${fileType}\nSize: ${(fileSize / 1024 / 1024).toFixed(2)} MB\n\nFile uploaded successfully. Content extraction failed but the file is available for reference in conversations.`;
          
          aiAnalysis = {
            summary: `Document uploaded: ${fileName}`,
            key_points: ['Document uploaded successfully', 'Content extraction failed', 'File available for reference'],
            content_type: fileType === 'application/pdf' ? 'pdf' : 'document',
            entities: []
          };
        } else {
          // File downloaded successfully, process based on type
          if (fileType === 'text/plain') {
            const textContent = await fileResponse.text();
            extractedContent = textContent.substring(0, 10000); // Limit to 10KB
            
            // Analyze text content with AI
            const textAnalysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                    content: 'Analyze this text document and provide a comprehensive summary, key points, and identify important entities or concepts. Format as: SUMMARY: [summary]\nKEY POINTS:\n- [point]\nENTITIES: [entity1, entity2]'
                  },
                  {
                    role: 'user',
                    content: `Document: ${fileName}\n\nContent:\n${extractedContent.substring(0, 3000)}`
                  }
                ],
                max_tokens: 500,
              }),
            });

            if (textAnalysisResponse.ok) {
              const textAnalysisData = await textAnalysisResponse.json();
              const analysis = textAnalysisData.choices[0].message.content;
              
              const summaryMatch = analysis.match(/SUMMARY:\s*([^\n]+)/);
              const keyPointsMatch = analysis.match(/KEY POINTS:\n((?:- [^\n]+\n?)+)/);
              const entitiesMatch = analysis.match(/ENTITIES:\s*([^\n]+)/);
              
              aiAnalysis = {
                summary: summaryMatch ? summaryMatch[1].trim() : 'Text document analysis',
                key_points: keyPointsMatch ? keyPointsMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(point => point.replace(/^-\s*/, '').trim()) : ['Text content analyzed'],
                content_type: 'text',
                entities: entitiesMatch ? entitiesMatch[1].split(',').map(e => e.trim()) : []
              };
            }
          } else {
            // For PDF and other documents, provide basic info
            extractedContent = `Document: ${fileName}\n\nFile type: ${fileType}\nSize: ${(fileSize / 1024 / 1024).toFixed(2)} MB\n\nThis ${fileType === 'application/pdf' ? 'PDF' : 'document'} has been uploaded successfully and is available for reference in your conversations.`;
            
            aiAnalysis = {
              summary: `${fileType === 'application/pdf' ? 'PDF' : 'Document'} uploaded: ${fileName}`,
              key_points: ['Document uploaded successfully', 'Available for reference', 'Content accessible in conversations'],
              content_type: fileType === 'application/pdf' ? 'pdf' : 'document',
              entities: []
            };
          }
        }
      }

    } catch (processingError) {
      console.error('File processing error:', processingError);
      extractedContent = `File: ${fileName}\n\nProcessing encountered an issue, but the file has been uploaded successfully and is available for reference in your conversations.`;
      
      aiAnalysis = {
        summary: `File uploaded: ${fileName}`,
        key_points: ['File uploaded successfully', 'Processing encountered issues', 'File available for reference'],
        content_type: fileType.startsWith('image/') ? 'image' : 'document',
        entities: []
      };
    }

    console.log('Processing completed successfully for:', fileName);

    return new Response(
      JSON.stringify({ 
        extractedContent,
        aiAnalysis,
        success: true 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        extractedContent: 'File upload completed but processing failed. File is still available for reference.',
        aiAnalysis: {
          summary: 'File upload completed with processing issues',
          key_points: ['File uploaded', 'Processing failed', 'File available for reference'],
          content_type: 'unknown',
          entities: []
        }
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
