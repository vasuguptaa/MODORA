import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-center mb-6">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-4">
                Something went wrong
              </h1>
              
              <p className="text-stone-600 dark:text-stone-400 mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              
              <button
                onClick={this.handleReload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Refresh Page</span>
              </button>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-stone-500 dark:text-stone-400 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 