import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Circle, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface LayerData {
    id: string;
    title: string;
    description: string;
    input: any;
    output: any;
    metrics: { name: string; value: string; status: 'success' | 'warning' | 'error' }[];
    failureModes: string[];
    evaluationMethods: string[];
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
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Auto-expand when active
    React.useEffect(() => {
        if (isActive) {
            setIsExpanded(true);
        }
    }, [isActive]);

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
                <div
                    className="flex items-center justify-between mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="space-y-1">
                        <h3 className={`text-lg font-semibold transition-colors ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {layer.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{layer.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isCompleted && (
                            <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                {layer.duration}ms
                            </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="mt-4 p-0 overflow-hidden border-muted/50 shadow-sm">
                                {/* Metrics Header */}
                                <div className="bg-muted/30 p-4 border-b border-border/50 flex flex-wrap gap-4">
                                    {layer.metrics.map((metric, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm bg-background px-3 py-1.5 rounded-full border border-border shadow-sm">
                                            <span className="text-muted-foreground">{metric.name}:</span>
                                            <span className="font-medium font-mono">{metric.value}</span>
                                            {metric.status === 'success' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                            {metric.status === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-500" />}
                                            {metric.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Data Flow */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                Input
                                            </h4>
                                            <div className="bg-zinc-950 text-zinc-50 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner border border-zinc-800">
                                                <pre>{JSON.stringify(layer.input, null, 2)}</pre>
                                            </div>
                                        </div>

                                        {(isActive || isCompleted) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Output
                                                </h4>
                                                <div className="bg-zinc-950 text-zinc-50 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner border border-zinc-800">
                                                    <pre>{JSON.stringify(layer.output, null, 2)}</pre>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Right Column: Evaluation Details */}
                                    <div className="space-y-6 border-l border-border/50 pl-0 lg:pl-8">
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" />
                                                Failure Modes
                                            </h4>
                                            <ul className="space-y-2">
                                                {layer.failureModes.map((mode, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 bg-muted/20 p-2 rounded">
                                                        <span className="text-red-500 mt-0.5">•</span>
                                                        {mode}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Evaluation Methods
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {layer.evaluationMethods.map((method, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                        {method}
                                                    </Badge>
                                                ))}
                                            </div>
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
