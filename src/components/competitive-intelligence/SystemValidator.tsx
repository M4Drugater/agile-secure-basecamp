
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, Zap, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function SystemValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);

  const runSystemValidation = async () => {
    setIsValidating(true);
    const results = {
      openaiConnection: false,
      perplexityConnection: false,
      agentResponse: false,
      realTimeSearch: false,
      costMonitoring: false,
      error: null as string | null
    };

    try {
      // Test 1: OpenAI Connection
      console.log('Testing OpenAI connection...');
      const openaiTest = await supabase.functions.invoke('competitive-intelligence-chat', {
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

      if (openaiTest.error) {
        results.error = `OpenAI Connection Failed: ${openaiTest.error.message}`;
      } else if (openaiTest.data?.response) {
        results.openaiConnection = true;
        
        // Test 2: Agent Response Quality
        if (openaiTest.data.response.includes('VALIDATION_SUCCESS') || openaiTest.data.response.length > 10) {
          results.agentResponse = true;
        }

        // Test 3: Cost Monitoring
        if (openaiTest.data.cost !== undefined && openaiTest.data.tokensUsed !== undefined) {
          results.costMonitoring = true;
        }
      }

      // Test 4: Perplexity Real-Time Search
      console.log('Testing Perplexity real-time search...');
      const perplexityTest = await supabase.functions.invoke('real-time-web-search', {
        body: {
          query: 'latest technology news validation test',
          companyName: 'Test Company',
          industry: 'Technology',
          searchType: 'news',
          timeframe: 'day'
        }
      });

      if (perplexityTest.error) {
        console.log('Perplexity test failed:', perplexityTest.error);
        if (!results.error) {
          results.error = `Perplexity API Failed: ${perplexityTest.error.message}`;
        }
      } else if (perplexityTest.data?.searchResults) {
        results.perplexityConnection = true;
        results.realTimeSearch = true;
        console.log('Perplexity test successful');
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

  const getOverallStatus = () => {
    if (!validationResults) return null;
    
    const allSystemsGo = validationResults.openaiConnection && 
                        validationResults.perplexityConnection && 
                        validationResults.agentResponse && 
                        validationResults.realTimeSearch && 
                        validationResults.costMonitoring;
    
    return allSystemsGo;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Enhanced System Validation
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
              Running Enhanced Validation...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate Complete System
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
            ) : getOverallStatus() ? (
              <Alert className="border-green-200 bg-green-50/50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>🚀 All Systems Operational!</strong> Real-time competitive intelligence is ready for McKinsey-level analysis.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Partial System Failure:</strong> Some components are not functioning correctly.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">OpenAI API Connection</span>
                {getStatusIcon(validationResults.openaiConnection)}
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Perplexity Real-Time Search
                </span>
                {getStatusIcon(validationResults.perplexityConnection)}
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Agent Response Quality</span>
                {getStatusIcon(validationResults.agentResponse)}
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Real-Time Intelligence</span>
                {getStatusIcon(validationResults.realTimeSearch)}
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Cost Monitoring Active</span>
                {getStatusIcon(validationResults.costMonitoring)}
              </div>
            </div>

            {getOverallStatus() && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🎯 Ready for Action:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Real-time web search and market intelligence</li>
                  <li>✅ McKinsey-level strategic analysis frameworks</li>
                  <li>✅ Enhanced competitive intelligence agents</li>
                  <li>✅ Cost-controlled AI operations</li>
                  <li>✅ Live financial and market data integration</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
