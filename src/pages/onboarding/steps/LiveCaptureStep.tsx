import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Activity } from 'lucide-react';
import type { OnboardingData } from '../../../types/onboarding';
import { motion } from 'framer-motion';

interface LiveCaptureStepProps {
    onNext: () => void;
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
}

const LiveCaptureStep = ({ onNext, data, updateData }: LiveCaptureStepProps) => {
    const [isSimulating, setIsSimulating] = useState(true);

    useEffect(() => {
        if (!isSimulating) return;

        // Simulate traces coming in
        const interval = setInterval(() => {
            if (data.tracesCollected < 5) {
                const newCount = data.tracesCollected + 1;
                updateData({ tracesCollected: newCount });

                if (newCount === 5) {
                    setIsSimulating(false);
                }
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [isSimulating, data.tracesCollected, updateData]);

    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-4">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100"
                >
                    <Activity className="w-8 h-8 text-blue-600" />
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-zinc-900">Establishing Uplink</h2>
                    <div className="flex items-center justify-center gap-2 text-zinc-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm">Listening for event stream...</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Traces Captured</div>
                        <div className="text-4xl font-bold text-zinc-900 mt-1">{data.tracesCollected} / 5</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-zinc-400 font-mono">
                            {data.tracesCollected === 5 ? 'COMPLETE' : 'RECEIVING...'}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-8">
                    <motion.div
                        className="h-full bg-zinc-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.tracesCollected / 5) * 100}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-100">
                        <span>LATEST EVENTS</span>
                        <span>STATUS</span>
                    </div>
                    {[...Array(data.tracesCollected)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between text-sm py-1"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-zinc-400">00:0{i + 1}</span>
                                <span className="text-zinc-700">POST /v1/chat/completions</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                <span>200 OK</span>
                            </div>
                        </motion.div>
                    ))}
                    {data.tracesCollected < 5 && (
                        <div className="flex items-center justify-between text-sm py-1 opacity-50">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-zinc-300">...</span>
                                <span className="text-zinc-400 italic">Waiting...</span>
                            </div>
                            <Loader2 className="w-4 h-4 text-zinc-300 animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onNext}
                    disabled={data.tracesCollected < 5}
                    className={`
                        flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all
                        ${data.tracesCollected >= 5
                            ? 'bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-105 shadow-lg shadow-zinc-200'
                            : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}
                    `}
                >
                    {data.tracesCollected >= 5 ? 'Analyze Data' : 'Waiting for Data...'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Helper for the check circle
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default LiveCaptureStep;
