
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface ActivatedStepProps {
    onNext: () => void;
}

const ActivatedStep = ({ onNext }: ActivatedStepProps) => {
    useEffect(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative mb-8"
            >
                <div className="absolute inset-0 bg-green-100 blur-[30px] rounded-full" />
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg relative z-10">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 max-w-lg mb-12"
            >
                <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
                    Connection Stabilized
                </h2>
                <p className="text-lg text-zinc-500">
                    Your agent has officially joined the network. <br />
                    All systems are green.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-12"
            >
                {[
                    { label: "Latency", value: "24ms", color: "text-green-600", bg: "bg-green-50" },
                    { label: "Security", value: "Encrypted", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Uptime", value: "99.9%", color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-zinc-100 ${stat.bg} flex flex-col items-center justify-center gap-1`}>
                        <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                        <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">{stat.label}</span>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <button
                    onClick={onNext}
                    className="group flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                >
                    <span>Proceed to Calibration</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </motion.div>
        </div >
    );
};

export default ActivatedStep;

