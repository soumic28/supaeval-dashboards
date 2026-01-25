import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

interface LayerCardProps {
    title: string;
    description: string;
    failureModes: string[];
    evaluationMethods: string[];
    metrics: string[];
    index: number;
}

export const LayerCard: React.FC<LayerCardProps> = ({
    title,
    description,
    failureModes,
    evaluationMethods,
    metrics,
    index,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="h-full p-6 hover:border-primary/50 transition-colors duration-300">
                <div className="flex flex-col h-full gap-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
                        <p className="text-muted-foreground text-sm">{description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Failure Modes
                            </h4>
                            <ul className="space-y-1.5">
                                {failureModes.map((mode, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span>•</span>
                                        {mode}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Evaluation Methods
                            </h4>
                            <ul className="space-y-1.5">
                                {evaluationMethods.map((method, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span>•</span>
                                        {method}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Metrics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {metrics.map((metric, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                        {metric}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
