import { Check, ShieldCheck, Code2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdapterReviewStepProps {
    onNext: () => void;
}

const AdapterReviewStep = ({ onNext }: AdapterReviewStepProps) => {
    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="space-y-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 mb-6"
                >
                    <Cpu className="w-8 h-8 text-blue-600" />
                </motion.div>
                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold tracking-tight text-zinc-900"
                    >
                        Schema Output
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-zinc-500 max-w-2xl mx-auto"
                    >
                        We've auto-mapped your agent's unique cognitive structure.
                    </motion.p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Raw Payload */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <h3 className="text-xs font-semibold uppercase text-zinc-500 tracking-wider flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        Raw Signal Input
                    </h3>
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 font-mono text-xs overflow-auto h-[400px] shadow-sm">
                        <pre className="text-zinc-600 leading-relaxed">
                            {`{
  "trace_id": "tr_89234",
  "timestamp": "2024-03-12T10:00:00Z",
  "kwargs": {
    "query": "How do I reset my password?",
    "user_id": "u_123"
{{ ... }}
    ]
  }
}`}
                        </pre>
                    </div>
                </motion.div>

                {/* Right: Extracted Mapper */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                >
                    <h3 className="text-xs font-semibold uppercase text-zinc-500 tracking-wider flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Translation Matrix
                    </h3>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-[400px] flex flex-col shadow-lg">
                        <div className="flex-1 p-6 overflow-auto relative">
                            {/* Scanline effect optional but good for 'matrix' feel even in minimal */}
                            <pre className="font-mono text-sm text-green-400 leading-relaxed">
                                {`def mapper(args, kwargs, result):
    return {
        "input_text": kwargs.get("query"),
        "output_text": result.get("answer"),
        "documents": result.get("citations"),
    }`}
                            </pre>
                        </div>
                        <div className="bg-zinc-800/50 p-4 text-xs flex items-center justify-between border-t border-zinc-800">
                            <span className="flex items-center gap-2 text-green-400 font-mono">
                                <ShieldCheck className="w-4 h-4" />
                                MAPPING_CONFIDENCE_SCORE: 0.89
                            </span>
                            <div className="flex gap-2 text-zinc-500 font-mono">
                                <span>LN: 12</span>
                                <span>COL: 40</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-sm"
            >
                <h3 className="font-medium text-zinc-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-600" />
                    Logic Assumptions
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <li className="flex items-center gap-3 text-sm text-zinc-500 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Input <span className="text-zinc-300">→</span> <code className="bg-white px-1.5 py-0.5 rounded text-zinc-700 border border-zinc-200 text-xs">kwargs["query"]</code>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-zinc-500 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Output <span className="text-zinc-300">→</span> <code className="bg-white px-1.5 py-0.5 rounded text-zinc-700 border border-zinc-200 text-xs">result["answer"]</code>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-zinc-500 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Context <span className="text-zinc-300">→</span> <code className="bg-white px-1.5 py-0.5 rounded text-zinc-700 border border-zinc-200 text-xs">citations</code>
                    </li>
                </ul>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-6 pt-4 pb-12"
            >
                <button
                    onClick={onNext}
                    className="flex items-center justify-center gap-2 px-10 py-3 text-sm font-semibold text-white transition-all bg-green-600 rounded-full hover:bg-green-700 hover:scale-105 active:scale-95 shadow-md shadow-green-100"
                >
                    <span className="relative flex items-center gap-2">
                        Confirm Translation
                        <Check className="w-4 h-4" />
                    </span>
                </button>
            </motion.div>
        </div>
    );
};

export default AdapterReviewStep;
