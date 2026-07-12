import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 flex items-center justify-center">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. This has been logged and we'll look into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm">
                <details>
                  <summary className="font-medium text-red-800 cursor-pointer mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 text-xs text-red-700 whitespace-pre-wrap">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 text-xs text-red-700 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              If this problem persists, please contact support.
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}


export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error handled:', error, errorInfo);
    
    
    
    
    
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Details');
      console.error('Error:', error);
      if (errorInfo) {
        console.error('Error Info:', errorInfo);
      }
      console.groupEnd();
    }
  };
};