import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

interface LayerData {
    id: string;
    title: string;
    description: string;
    input: any;
    output: any;
    metrics: { name: string; value: string; status: 'success' | 'warning' | 'error' }[];
    duration: number;
}

interface LayerSimulationProps {
    layer: LayerData;
    isActive: boolean;
    isCompleted: boolean;
    isPending: boolean;
}

export const LayerSimulation: React.FC<LayerSimulationProps> = ({
    layer,
    isActive,
    isCompleted,
    isPending,
}) => {
    return (
        <div className={`relative flex gap-6 ${isPending ? 'opacity-50' : 'opacity-100'} transition-opacity duration-500`}>
            {/* Timeline Line */}
            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border -z-10 last:hidden" />

            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-primary bg-primary text-primary-foreground' :
                        'border-muted-foreground/30 bg-background text-muted-foreground'
                    }`}>
                    {isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <Circle className="w-4 h-4" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-12">
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {layer.title}
                    </h3>
                    {isCompleted && (
                        <span className="text-xs text-muted-foreground font-mono">
                            {layer.duration}ms
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">{layer.description}</p>

                <AnimatePresence>
                    {(isActive || isCompleted) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-4 bg-muted/30 border-muted/50">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Input/Output Section */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Input</h4>
                                            <div className="bg-background border border-border rounded-md p-3 font-mono text-xs overflow-x-auto">
                                                <pre>{JSON.stringify(layer.input, null, 2)}</pre>
                                            </div>
                                        </div>

                                        {isCompleted && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Output</h4>
                                                <div className="bg-background border border-border rounded-md p-3 font-mono text-xs overflow-x-auto">
                                                    <pre>{JSON.stringify(layer.output, null, 2)}</pre>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Metrics Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Live Metrics</h4>
                                        <div className="space-y-3">
                                            {layer.metrics.map((metric, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * i }}
                                                    className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0"
                                                >
                                                    <span className="text-muted-foreground">{metric.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium font-mono">{metric.value}</span>
                                                        {metric.status === 'success' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                                        {metric.status === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-500" />}
                                                        {metric.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
