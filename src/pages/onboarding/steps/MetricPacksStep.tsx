
import { Share2, MessageSquare, Box, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { OnboardingData } from '../../../types/onboarding';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface MetricPacksStepProps {
    onNext: () => void;
    data: OnboardingData;
}

const MetricPacksStep = ({ onNext, data }: MetricPacksStepProps) => {
    const { updateProfile } = useUserProfile();

    // Mapping agent modes to recommended packs
    const recommendations = {
        'RAG Agent': ['hallucination', 'relevance'],
        'Chat Agent': ['coherence', 'tone'],
        'Router Agent': ['latency', 'tool_usage']
    };

    const recommended = recommendations[data.agentMode];

    const packs = [
        {
            id: 'hallucination',
            name: 'Reality Anchor',
            desc: 'Detects fabrications.',
            icon: Box,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-pink-200'
        },
        {
            id: 'relevance',
            name: 'Semantic Lock',
            desc: 'Ensures context matches intent.',
            icon: Share2,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200'
        },
        {
            id: 'coherence',
            name: 'Thought Stream',
            desc: 'Analyzes logical flow.',
            icon: MessageSquare,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200'
        },
    ];

    const togglePack = (packId: string) => {
        // In a real app we'd save this selection
        console.log('Toggled', packId);
    };

    const handleComplete = () => {
        updateProfile({ showOnboarding: false });
        onNext();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold tracking-tight text-zinc-900"
                >
                    Calibrate Sensors
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 max-w-xl mx-auto"
                >
                    Based on your agent's mode (<span className="text-zinc-900 font-medium">{data.agentMode}</span>), we've selected optimal metrics.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packs.map((pack, i) => {
                    const isRecommended = recommended.includes(pack.id);
                    return (
                        <motion.div
                            key={pack.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            onClick={() => togglePack(pack.id)}
                            className={`
                                relative group cursor-pointer rounded-xl p-6 border transition-all duration-200
                                ${isRecommended
                                    ? `bg-white ${pack.border} shadow-md ring-1 ring-offset-0 ${pack.border.replace('border', 'ring')}`
                                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'}
                            `}
                        >
                            {isRecommended && (
                                <div className="absolute -top-3 -right-3 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                    RECOMMENDED
                                </div>
                            )}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${pack.bg} ${pack.color}`}>
                                <pack.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold mb-1 text-zinc-900">{pack.name}</h3>
                            <p className="text-xs text-zinc-500 mb-4 h-8 leading-snug">
                                {pack.desc}
                            </p>

                            <div className={`flex items-center gap-2 text-xs font-semibold ${isRecommended ? 'text-zinc-700' : 'text-zinc-400'} `}>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isRecommended ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'} `}>
                                    {isRecommended && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                {isRecommended ? 'Active' : 'Standby'}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center pt-12"
            >
                <button
                    onClick={handleComplete}
                    className="group relative inline-flex items-center justify-center gap-2 px-10 py-3 text-sm font-semibold text-white transition-all bg-zinc-900 rounded-full hover:bg-zinc-800 shadow-xl shadow-zinc-200"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Initialize Dashboard
                        <Share2 className="w-4 h-4 rotate-90" />
                    </span>
                </button>
            </motion.div>
        </div>
    );
};

export default MetricPacksStep;

