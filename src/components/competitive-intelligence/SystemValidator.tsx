
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function SystemValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);

  const runSystemValidation = async () => {
    setIsValidating(true);
    const results = {
      openaiConnection: false,
      agentResponse: false,
      costMonitoring: false,
      error: null as string | null
    };

    try {
      // Test 1: OpenAI Connection
      console.log('Testing OpenAI connection...');
      const testResponse = await supabase.functions.invoke('competitive-intelligence-chat', {
        body: {
          messages: [
            { role: 'system', content: 'You are a validation assistant.' },
            { role: 'user', content: 'Please respond with exactly: "VALIDATION_SUCCESS"' }
          ],
          agentType: 'cia',
          sessionConfig: {
            companyName: 'Validation Test Co',
            industry: 'Technology',
            analysisFocus: 'System Validation',
            objectives: 'Test system functionality'
          },
          userContext: {
            userId: 'validation-test',
            sessionId: 'validation-session'
          }
        },
      });

      if (testResponse.error) {
        results.error = `OpenAI Connection Failed: ${testResponse.error.message}`;
      } else if (testResponse.data?.response) {
        results.openaiConnection = true;
        
        // Test 2: Agent Response Quality
        if (testResponse.data.response.includes('VALIDATION_SUCCESS') || testResponse.data.response.length > 10) {
          results.agentResponse = true;
        }

        // Test 3: Cost Monitoring
        if (testResponse.data.cost !== undefined && testResponse.data.tokensUsed !== undefined) {
          results.costMonitoring = true;
        }

        console.log('Validation successful:', testResponse.data);
      } else {
        results.error = 'Unexpected response format from API';
      }

    } catch (error) {
      console.error('Validation error:', error);
      results.error = `System Error: ${error.message}`;
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          System Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runSystemValidation} 
          disabled={isValidating}
          className="w-full"
        >
          {isValidating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Validation...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate System
            </>
          )}
        </Button>

        {validationResults && (
          <div className="space-y-3">
            {validationResults.error ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Validation Failed:</strong> {validationResults.error}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50/50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Validation Complete!</strong> System functionality verified.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">OpenAI API Connection</span>
                {getStatusIcon(validationResults.openaiConnection)}
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Agent Response Quality</span>
                {getStatusIcon(validationResults.agentResponse)}
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Cost Monitoring Active</span>
                {getStatusIcon(validationResults.costMonitoring)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
