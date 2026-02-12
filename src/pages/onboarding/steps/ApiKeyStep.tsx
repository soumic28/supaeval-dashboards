
import { useState } from 'react';
import { Copy, Check, ExternalLink, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyStepProps {
    onNext: () => void;
    apiKey: string;
}

const ApiKeyStep = ({ onNext, apiKey }: ApiKeyStepProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-16 h-16 mx-auto bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200"
                >
                    <Shield className="w-8 h-8 text-zinc-900" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-zinc-900 tracking-tight"
                >
                    Authenticate
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-500 max-w-lg mx-auto"
                >
                    Use this key to authenticate your agent's requests. Keep it secure.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-8 lg:grid-cols-2"
            >
                {/* API Key Card */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-zinc-500 tracking-widest uppercase ml-1">Secret Key</label>
                    <div className="relative group">
                        <div className="relative flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-xl shadow-sm">
                            <code className="flex-1 font-mono text-sm text-zinc-700 truncate px-2">{apiKey}</code>
                            <button
                                onClick={handleCopy}
                                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                title="Copy to clipboard"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {copied ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Check className="w-4 h-4 text-green-600" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2 px-1">This key grants admin access to your project.</p>
                    </div>
                </div>

                {/* Integration Code */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-500 tracking-widest uppercase ml-1">Quick Setup</label>
                        <div className="flex gap-1.5 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-zinc-300" />
                            <div className="w-2 h-2 rounded-full bg-zinc-300" />
                            <div className="w-2 h-2 rounded-full bg-zinc-300" />
                        </div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50/50 font-mono text-xs shadow-sm">
                        <div className="p-4 space-y-1 overflow-x-auto text-zinc-600">
                            <div className="flex"><span className="text-purple-600 mr-2">from</span> supaeval <span className="text-purple-600 mx-2">import</span> Agent</div>
                            <div className="flex text-zinc-400 my-1"># Initialize</div>
                            <div className="flex">agent = Agent(</div>
                            <div className="flex ml-4">api_key=<span className="text-green-600">"{apiKey.slice(0, 8)}..."</span>,</div>
                            <div className="flex ml-4">monitor=<span className="text-blue-600">True</span></div>
                            <div className="flex">)</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-6 pt-8"
            >
                <button
                    onClick={onNext}
                    className="group relative inline-flex items-center justify-center gap-2 px-10 py-3 text-sm font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 shadow-lg shadow-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                    I've Added The Key
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
                <p className="text-xs text-zinc-400 animate-pulse">
                    Waiting for first event...
                </p>
            </motion.div>
        </div>
    );
};

export default ApiKeyStep;

