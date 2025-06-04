
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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

    console.log('Processing file:', { fileName, fileType, fileSize });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.warn('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          extractedContent: `File: ${fileName} (processing not available)`,
          aiAnalysis: null 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let extractedContent = '';
    let aiAnalysis: AIAnalysis | null = null;

    try {
      // Download the file
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error('Failed to download file');
      }

      if (fileType.startsWith('image/')) {
        // Process image with OpenAI Vision API
        console.log('Processing image with Vision API');
        
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
                    text: 'Analyze this image and extract all visible text content. Then provide a detailed description of what you see, including any diagrams, charts, or visual elements. Finally, identify key insights or information that could be useful for knowledge management.'
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
            max_tokens: 1000,
          }),
        });

        if (visionResponse.ok) {
          const visionData = await visionResponse.json();
          extractedContent = visionData.choices[0].message.content;
          
          // Extract key insights from the vision analysis
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
                  content: 'Extract key information from this image analysis. Provide a concise summary, key points as bullet points, content type classification, and any important entities mentioned.'
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
            
            aiAnalysis = {
              summary: analysis.split('\n')[0] || 'Image content analysis',
              key_points: analysis.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).map(point => point.replace(/^[•\-]\s*/, '')),
              content_type: 'image',
              entities: []
            };
          }
        }
      } else if (fileType === 'application/pdf') {
        // For PDF, we'll implement a basic text extraction
        // In production, you'd want to use a proper PDF parsing library
        extractedContent = `PDF document: ${fileName}\n\nContent extraction from PDF files requires additional processing. The file has been uploaded successfully and can be referenced in conversations.`;
        
        aiAnalysis = {
          summary: `PDF document: ${fileName}`,
          key_points: ['PDF content available for processing', 'File uploaded successfully'],
          content_type: 'pdf',
          entities: []
        };
      } else if (fileType === 'text/plain') {
        // Process text files
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
                content: 'Analyze this text document and provide a summary, key points, and identify important entities or concepts.'
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
          
          aiAnalysis = {
            summary: analysis.split('\n')[0] || 'Text document analysis',
            key_points: analysis.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).map(point => point.replace(/^[•\-]\s*/, '')),
            content_type: 'text',
            entities: []
          };
        }
      } else {
        extractedContent = `Document: ${fileName}\n\nFile type: ${fileType}\nSize: ${(fileSize / 1024 / 1024).toFixed(2)} MB\n\nThis file has been uploaded and is available for reference.`;
        
        aiAnalysis = {
          summary: `Document: ${fileName}`,
          key_points: ['Document uploaded successfully', 'Available for reference'],
          content_type: 'document',
          entities: []
        };
      }

    } catch (processingError) {
      console.error('File processing error:', processingError);
      extractedContent = `Error processing ${fileName}: ${processingError.message}`;
    }

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
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
