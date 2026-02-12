import { AlertTriangle, Clock, Wrench, ArrowRight } from 'lucide-react';

interface FirstDashboardStepProps {
    onNext: () => void;
}

const FirstDashboardStep = ({ onNext }: FirstDashboardStepProps) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Here’s what we’re seeing so far</h2>
                <p className="text-muted-foreground">
                    Even before custom mapping, we can spot potential issues.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-semibold">Hallucination Risk</span>
                    </div>
                    <div className="text-4xl font-bold">42%</div>
                    <p className="text-sm text-muted-foreground">High risk detected in recent responses.</p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-yellow-500">
                        <Wrench className="w-6 h-6" />
                        <span className="font-semibold">Tool Failures</span>
                    </div>
                    <div className="text-4xl font-bold">3</div>
                    <p className="text-sm text-muted-foreground">Detected in the last 10 minutes.</p>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-green-500">
                        <Clock className="w-6 h-6" />
                        <span className="font-semibold">Avg Latency</span>
                    </div>
                    <div className="text-4xl font-bold">812ms</div>
                    <p className="text-sm text-muted-foreground">Response times are healthy.</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                    <strong>Note:</strong> Mapping confidence is low — results may be incomplete. Improve mapping to see full details.
                </p>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={onNext}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
                >
                    Improve Mapping Accuracy
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default FirstDashboardStep;
