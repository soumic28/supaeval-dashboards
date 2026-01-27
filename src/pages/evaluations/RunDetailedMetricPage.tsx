import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

import {
    Activity,
    Brain,
    Database,
    Save,
    Wrench,
    MessageSquare,
    Cpu,
    ArrowRight,

} from 'lucide-react';
import { motion } from 'framer-motion';

const layers = [
    {
        id: 'input',
        name: 'Input & Intent Layer',
        subtext: 'Layer 3.1',
        icon: Activity,
        description: 'Interprets user query, detects intent, constraints, and task type.',
        status: 'Active',
        metrics: [
            { name: 'Intent Classification Accuracy', value: '98', unit: '', trend: 'up' },
            { name: 'Constraint Adherence Score', value: '92', unit: '', trend: 'flat' },
            { name: 'Over-response / Under-response Rate', value: '5', unit: '%', trend: 'down' },
            { name: 'Prompt Ambiguity Detection Rate', value: '88', unit: '', trend: 'up' },
        ]
    },
    {
        id: 'planning',
        name: 'Planning & Reasoning Layer',
        subtext: 'Layer 3.2',
        icon: Brain,
        description: 'Breaks the task into steps and determines execution order.',
        status: 'Active',
        metrics: [
            { name: 'Plan Accuracy', value: '94', unit: '', trend: 'up' },
            { name: 'Step Coverage', value: '96', unit: '%', trend: 'flat' },
            { name: 'Reasoning Coherence Score', value: '8.5', unit: '/10', trend: 'up' },
            { name: 'Hallucinated Step Rate', value: '2', unit: '%', trend: 'down' },
        ]
    },
    {
        id: 'retrieval',
        name: 'Retrieval & Context Layer',
        subtext: 'Layer 3.3',
        icon: Database,
        description: 'Fetches documents and supplies grounding context.',
        status: 'Active',
        metrics: [
            { name: 'Recall@K', value: '0.85', unit: '', trend: 'flat' },
            { name: 'Precision@K', value: '0.91', unit: '', trend: 'up' },
            { name: 'Context Relevance Score', value: '9.2', unit: '/10', trend: 'up' },
            { name: 'Grounding Coverage', value: '89', unit: '%', trend: 'down' },
        ]
    },
    {
        id: 'memory',
        name: 'Memory Layer',
        subtext: 'Layer 3.4',
        icon: Save,
        description: 'Stores and retrieves user context and maintains state.',
        status: 'Active',
        metrics: [
            { name: 'Memory Recall Accuracy', value: '99', unit: '%', trend: 'up' },
            { name: 'State Consistency', value: '100', unit: '%', trend: 'flat' },
        ]
    },
    {
        id: 'tool',
        name: 'Tool & Action Layer',
        subtext: 'Layer 3.5',
        icon: Wrench,
        description: 'Calls external tools, parses outputs, and handles failures.',
        status: 'Active',
        metrics: [
            { name: 'Tool Selection Accuracy', value: '97', unit: '%', trend: 'up' },
            { name: 'Execution Success Rate', value: '95', unit: '%', trend: 'down' },
        ]
    },
    {
        id: 'generation',
        name: 'Generation Layer',
        subtext: 'Layer 3.6',
        icon: MessageSquare,
        description: 'Produces the final user-visible output.',
        status: 'Active',
        metrics: [
            { name: 'Response Quality', value: '4.8', unit: '/5', trend: 'up' },
            { name: 'Hallucination Rate', value: '0.5', unit: '%', trend: 'down' },
        ]
    },
    {
        id: 'system',
        name: 'System Layer',
        subtext: 'Layer 3.7',
        icon: Cpu,
        description: 'Ensures reliability, performance, and ROI.',
        status: 'Active',
        metrics: [
            { name: 'Latency', value: '1.2', unit: 's', trend: 'flat' },
            { name: 'Cost per Run', value: '$0.02', unit: '', trend: 'flat' },
        ]
    }
];

export default function RunDetailedMetricPage() {
    const [selectedLayerId, setSelectedLayerId] = useState<string>('input');

    const handleLayerClick = (id: string) => {
        setSelectedLayerId(id);
        // Scroll to the section if needed, or just update view
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Left Sidebar Menu */}
            <div className="w-64 border-r border-border bg-card/50 overflow-y-auto p-4 space-y-2 hidden md:block">
                <h2 className="text-lg font-semibold mb-4 px-2">Layers</h2>
                {layers.map((layer) => (
                    <button
                        key={layer.id}
                        onClick={() => handleLayerClick(layer.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${selectedLayerId === layer.id
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <layer.icon className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                            <span>{layer.name}</span>
                            <span className="text-[10px] opacity-70">{layer.subtext}</span>
                        </div>
                        {selectedLayerId === layer.id && (
                            <motion.div
                                layoutId="active-indicator"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">System Overview</h1>
                        <p className="text-muted-foreground">Real-time evaluation metrics across all agent layers.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {layers.map((layer) => (
                            <motion.div
                                id={layer.id}
                                key={layer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`col-span-1 ${selectedLayerId === layer.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl' : ''
                                    }`}
                                onClick={() => setSelectedLayerId(layer.id)}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
                                                <layer.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold leading-tight">
                                                    {layer.name}
                                                </CardTitle>
                                                <p className="text-xs text-primary font-mono mt-1">{layer.subtext}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                            {layer.status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                                            {layer.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            {layer.metrics.map((metric) => (
                                                <div key={metric.name} className="bg-background/50 p-3 rounded-lg border border-border/50">
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 line-clamp-2 h-8">
                                                        {metric.name}
                                                    </p>
                                                    <div className="flex items-end justify-between">
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className="text-xl font-bold">{metric.value}</span>
                                                            <span className="text-xs text-muted-foreground">{metric.unit}</span>
                                                        </div>
                                                        {metric.trend === 'up' ? (
                                                            <ArrowRight className="w-3 h-3 text-green-500 -rotate-45" />
                                                        ) : metric.trend === 'down' ? (
                                                            <ArrowRight className="w-3 h-3 text-red-500 rotate-45" />
                                                        ) : (
                                                            <div className="w-2 h-0.5 bg-muted-foreground/50 my-1.5" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
