
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface KnowledgeErrorBoundaryProps {
  children: React.ReactNode;
}

interface KnowledgeErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class KnowledgeErrorBoundary extends React.Component<
  KnowledgeErrorBoundaryProps,
  KnowledgeErrorBoundaryState
> {
  constructor(props: KnowledgeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): KnowledgeErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Knowledge Base Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Knowledge Base Error</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              Something went wrong while loading the knowledge base. This might be due to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Network connectivity issues</li>
              <li>Database connection problems</li>
              <li>Invalid data format</li>
            </ul>
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
