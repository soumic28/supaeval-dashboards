import { ArrowRight, Sparkles, Zap, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeStepProps {
    onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
    return (
        <div className="flex flex-col items-center text-center space-y-12 max-w-3xl mx-auto py-8">

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200"
            >
                <BrainCircuit className="w-10 h-10 text-zinc-900" />
            </motion.div>

            <div className="space-y-4 max-w-2xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900"
                >
                    Connect Your Intelligence
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-zinc-500 leading-relaxed"
                >
                    Establish a direct link to your agent. <br className="hidden md:block" />
                    Monitor, evaluate, and optimize in real-time.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <button
                    onClick={onNext}
                    className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-zinc-200"
                >
                    <Sparkles className="w-4 h-4 text-zinc-400" />
                    <span>Initiate Connection</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full pt-12 border-t border-zinc-100"
            >
                {[
                    { icon: Zap, title: "Instant Sync", desc: "Connects in < 2 mins" },
                    { icon: BrainCircuit, title: "Auto-Mapping", desc: "Detects schema automatically" },
                    { icon: Sparkles, title: "Zero Config", desc: "No complex setup needed" }
                ].map((item, i) => (
                    <div key={i} className="group p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-colors shadow-sm hover:shadow-md">
                        <item.icon className="w-6 h-6 mb-3 text-zinc-900" />
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">{item.title}</h3>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default WelcomeStep;
