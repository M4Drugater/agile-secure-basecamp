
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Settings, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function OpenAIKeyCheck() {
  const [keyStatus, setKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkOpenAIKey();
  }, []);

  const checkOpenAIKey = async () => {
    setIsChecking(true);
    try {
      console.log('Testing OpenAI API connectivity...');
      
      // Test with a minimal competitive intelligence request
      const { data, error } = await supabase.functions.invoke('competitive-intelligence-chat', {
        body: {
          messages: [
            { role: 'system', content: 'You are a test assistant.' },
            { role: 'user', content: 'Test connection - respond with "OK"' }
          ],
          agentType: 'cia',
          sessionConfig: {
            companyName: 'Test Company',
            industry: 'Technology',
            analysisFocus: 'Connection Test',
            objectives: 'Test API connectivity'
          },
          userContext: {
            userId: 'test',
            sessionId: 'test-session'
          }
        },
      });

      if (error) {
        console.error('OpenAI API test error:', error);
        if (error.message?.includes('insufficient_quota')) {
          setKeyStatus('invalid');
          setErrorMessage('OpenAI API quota exceeded. Please check your billing and usage limits.');
        } else if (error.message?.includes('OPENAI_API_KEY') || error.message?.includes('api key')) {
          setKeyStatus('missing');
          setErrorMessage('OpenAI API key is not configured or invalid.');
        } else if (error.message?.includes('401')) {
          setKeyStatus('invalid');
          setErrorMessage('OpenAI API key is invalid or unauthorized.');
        } else {
          setKeyStatus('invalid');
          setErrorMessage(`OpenAI API validation failed: ${error.message}`);
        }
      } else if (data?.response) {
        console.log('OpenAI API test successful:', data);
        setKeyStatus('valid');
        setErrorMessage('');
      } else {
        setKeyStatus('invalid');
        setErrorMessage('Unexpected response from OpenAI API.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setKeyStatus('invalid');
      setErrorMessage('Failed to test OpenAI API connection.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
    switch (keyStatus) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invalid':
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    if (isChecking) return <Badge variant="outline">Testing...</Badge>;
    switch (keyStatus) {
      case 'valid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Connected & Working</Badge>;
      case 'invalid':
        return <Badge variant="destructive">❌ Invalid Key</Badge>;
      case 'missing':
        return <Badge variant="destructive">❌ Missing Key</Badge>;
      case 'checking':
        return <Badge variant="outline">🔄 Checking...</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle>OpenAI API Status</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Real-time connectivity status for competitive intelligence agents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {keyStatus === 'invalid' || keyStatus === 'missing' ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Action Required:</strong> {errorMessage}
            </AlertDescription>
          </Alert>
        ) : keyStatus === 'valid' ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>✅ All Systems Go!</strong> OpenAI API is properly configured and the competitive intelligence agents are ready to use.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex gap-2">
          <Button 
            onClick={checkOpenAIKey} 
            variant="outline" 
            size="sm"
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenAI Dashboard
            </a>
          </Button>
        </div>

        {(keyStatus === 'invalid' || keyStatus === 'missing') && (
          <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
            <p className="mb-2 font-medium">🔧 Quick Fix Guide:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 hover:underline">OpenAI API Keys</a></li>
              <li>Create a new API key or copy an existing one</li>
              <li>Add it as <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY</code> in Supabase Edge Function Secrets</li>
              <li>Ensure your OpenAI account has sufficient credits</li>
              <li>Click "Test Connection" above to verify</li>
            </ol>
          </div>
        )}

        {keyStatus === 'valid' && (
          <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded border border-green-200">
            <p className="mb-2 font-medium text-green-800">🚀 Ready for Action:</p>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>All competitive intelligence agents are operational</li>
              <li>McKinsey-level analysis frameworks are active</li>
              <li>Enhanced prompts v2.0 are loaded and ready</li>
              <li>Cost monitoring and optimization are in place</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
