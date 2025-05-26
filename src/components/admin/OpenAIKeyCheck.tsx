
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function OpenAIKeyCheck() {
  const [keyStatus, setKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkOpenAIKey();
  }, []);

  const checkOpenAIKey = async () => {
    try {
      // Test the OpenAI API key by making a simple request
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'article',
          topic: 'Test connection',
          style: 'professional',
          length: 'short',
          model: 'gpt-4o-mini',
        },
      });

      if (error) {
        if (error.message?.includes('insufficient_quota')) {
          setKeyStatus('invalid');
          setErrorMessage('OpenAI API quota exceeded. Please check your billing and usage limits.');
        } else if (error.message?.includes('OPENAI_API_KEY')) {
          setKeyStatus('missing');
          setErrorMessage('OpenAI API key is not configured.');
        } else {
          setKeyStatus('invalid');
          setErrorMessage('OpenAI API key validation failed.');
        }
      } else {
        setKeyStatus('valid');
      }
    } catch (error) {
      setKeyStatus('invalid');
      setErrorMessage('Failed to validate OpenAI API key.');
    }
  };

  const getStatusIcon = () => {
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
    switch (keyStatus) {
      case 'valid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>;
      case 'invalid':
        return <Badge variant="destructive">Invalid Key</Badge>;
      case 'missing':
        return <Badge variant="destructive">Missing Key</Badge>;
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
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
            <CardTitle>OpenAI API Configuration</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Monitor OpenAI API key status and connectivity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {keyStatus === 'invalid' || keyStatus === 'missing' ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        ) : keyStatus === 'valid' ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              OpenAI API is properly configured and accessible.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex gap-2">
          <Button onClick={checkOpenAIKey} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Check Again
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenAI API Keys
            </a>
          </Button>
        </div>

        {(keyStatus === 'invalid' || keyStatus === 'missing') && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">To fix this issue:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your OpenAI account dashboard</li>
              <li>Create or copy your API key</li>
              <li>Add it as OPENAI_API_KEY in Supabase Edge Function secrets</li>
              <li>Ensure your OpenAI account has sufficient credits</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
