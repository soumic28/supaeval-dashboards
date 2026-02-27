import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
                    <div className="max-w-md space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-destructive">Oops!</h1>
                        <h2 className="text-xl font-semibold">Something went wrong</h2>
                        <p className="text-muted-foreground break-words">
                            {this.state.error?.message || "An unexpected error occurred."}
                        </p>
                        <div className="pt-4">
                            <Button onClick={() => window.location.reload()} size="lg">
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
