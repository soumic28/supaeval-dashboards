import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class AppInsightsErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error(error, {
            componentStack: errorInfo.componentStack,
            location: 'ErrorBoundary'
        });
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
                    <div className="max-w-md w-full space-y-4 text-center">
                        <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
                        <p className="text-xl font-medium">Something went wrong.</p>
                        <p className="text-muted-foreground break-words">
                            {this.state.error?.message || 'An unexpected error occurred in the application.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
