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
    TrendingUp,
    TrendingDown,
    Minus,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced layer data with comprehensive metrics
const layers = [
    {
        id: 'input',
        name: 'Input & Intent Layer',
        subtext: 'Layer 3.1',
        icon: Activity,
        description: 'Interprets user query, detects intent, constraints, and task type.',
        status: 'Active',
        color: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'border-blue-500/30',
        metrics: [
            { name: 'Intent Classification Accuracy', value: '98.5', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Constraint Adherence Score', value: '92.3', unit: '%', trend: 'up', threshold: 90, status: 'success' },
            { name: 'Over-response Rate', value: '3.2', unit: '%', trend: 'down', threshold: 5, status: 'success' },
            { name: 'Under-response Rate', value: '1.8', unit: '%', trend: 'down', threshold: 5, status: 'success' },
            { name: 'Prompt Ambiguity Detection', value: '88.7', unit: '%', trend: 'up', threshold: 85, status: 'success' },
            { name: 'Query Processing Time', value: '145', unit: 'ms', trend: 'flat', threshold: 200, status: 'success' },
            { name: 'Intent Confidence Score', value: '94.2', unit: '%', trend: 'up', threshold: 90, status: 'success' },
            { name: 'Multi-intent Detection', value: '89.5', unit: '%', trend: 'up', threshold: 85, status: 'success' },
        ]
    },
    {
        id: 'planning',
        name: 'Planning & Reasoning Layer',
        subtext: 'Layer 3.2',
        icon: Brain,
        description: 'Breaks the task into steps and determines execution order.',
        status: 'Active',
        color: 'from-purple-500/20 to-pink-500/20',
        borderColor: 'border-purple-500/30',
        metrics: [
            { name: 'Plan Accuracy', value: '94.8', unit: '%', trend: 'up', threshold: 90, status: 'success' },
            { name: 'Step Coverage', value: '96.2', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Reasoning Coherence Score', value: '8.7', unit: '/10', trend: 'up', threshold: 8, status: 'success' },
            { name: 'Hallucinated Step Rate', value: '1.5', unit: '%', trend: 'down', threshold: 3, status: 'success' },
            { name: 'Plan Completeness', value: '93.4', unit: '%', trend: 'up', threshold: 90, status: 'success' },
            { name: 'Dependency Resolution', value: '97.8', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Planning Latency', value: '320', unit: 'ms', trend: 'flat', threshold: 500, status: 'success' },
            { name: 'Step Optimization Score', value: '91.2', unit: '%', trend: 'up', threshold: 85, status: 'success' },
        ]
    },
    {
        id: 'retrieval',
        name: 'Retrieval & Context Layer',
        subtext: 'Layer 3.3',
        icon: Database,
        description: 'Fetches documents and supplies grounding context.',
        status: 'Active',
        color: 'from-green-500/20 to-emerald-500/20',
        borderColor: 'border-green-500/30',
        metrics: [
            { name: 'Recall@5', value: '0.87', unit: '', trend: 'up', threshold: 0.8, status: 'success' },
            { name: 'Precision@5', value: '0.92', unit: '', trend: 'up', threshold: 0.85, status: 'success' },
            { name: 'Context Relevance Score', value: '9.3', unit: '/10', trend: 'up', threshold: 8.5, status: 'success' },
            { name: 'Grounding Coverage', value: '89.4', unit: '%', trend: 'up', threshold: 85, status: 'success' },
            { name: 'NDCG@10', value: '0.91', unit: '', trend: 'up', threshold: 0.85, status: 'success' },
            { name: 'Retrieval Latency', value: '180', unit: 'ms', trend: 'flat', threshold: 250, status: 'success' },
            { name: 'Context Diversity', value: '0.78', unit: '', trend: 'flat', threshold: 0.7, status: 'success' },
            { name: 'Source Attribution Accuracy', value: '95.6', unit: '%', trend: 'up', threshold: 90, status: 'success' },
        ]
    },
    {
        id: 'memory',
        name: 'Memory Layer',
        subtext: 'Layer 3.4',
        icon: Save,
        description: 'Stores and retrieves user context and maintains state.',
        status: 'Active',
        color: 'from-orange-500/20 to-amber-500/20',
        borderColor: 'border-orange-500/30',
        metrics: [
            { name: 'Memory Recall Accuracy', value: '99.2', unit: '%', trend: 'up', threshold: 98, status: 'success' },
            { name: 'State Consistency', value: '100', unit: '%', trend: 'flat', threshold: 99, status: 'success' },
            { name: 'Context Window Utilization', value: '67.8', unit: '%', trend: 'flat', threshold: 80, status: 'warning' },
            { name: 'Memory Persistence Rate', value: '98.9', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Session Continuity Score', value: '96.5', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Memory Access Latency', value: '45', unit: 'ms', trend: 'flat', threshold: 100, status: 'success' },
            { name: 'State Corruption Rate', value: '0.1', unit: '%', trend: 'down', threshold: 1, status: 'success' },
            { name: 'Cross-session Recall', value: '94.3', unit: '%', trend: 'up', threshold: 90, status: 'success' },
        ]
    },
    {
        id: 'tool',
        name: 'Tool & Action Layer',
        subtext: 'Layer 3.5',
        icon: Wrench,
        description: 'Calls external tools, parses outputs, and handles failures.',
        status: 'Active',
        color: 'from-red-500/20 to-rose-500/20',
        borderColor: 'border-red-500/30',
        metrics: [
            { name: 'Tool Selection Accuracy', value: '97.4', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Execution Success Rate', value: '95.8', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Parameter Validation Rate', value: '99.1', unit: '%', trend: 'up', threshold: 98, status: 'success' },
            { name: 'Error Recovery Rate', value: '92.3', unit: '%', trend: 'up', threshold: 90, status: 'success' },
            { name: 'Tool Response Parsing', value: '98.7', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Average Tool Latency', value: '450', unit: 'ms', trend: 'flat', threshold: 600, status: 'success' },
            { name: 'Retry Success Rate', value: '87.5', unit: '%', trend: 'up', threshold: 80, status: 'success' },
            { name: 'Tool Availability', value: '99.5', unit: '%', trend: 'flat', threshold: 99, status: 'success' },
        ]
    },
    {
        id: 'generation',
        name: 'Generation Layer',
        subtext: 'Layer 3.6',
        icon: MessageSquare,
        description: 'Produces the final user-visible output.',
        status: 'Active',
        color: 'from-indigo-500/20 to-violet-500/20',
        borderColor: 'border-indigo-500/30',
        metrics: [
            { name: 'Response Quality Score', value: '4.8', unit: '/5', trend: 'up', threshold: 4.5, status: 'success' },
            { name: 'Hallucination Rate', value: '0.4', unit: '%', trend: 'down', threshold: 1, status: 'success' },
            { name: 'Factual Accuracy', value: '97.9', unit: '%', trend: 'up', threshold: 95, status: 'success' },
            { name: 'Response Completeness', value: '95.3', unit: '%', trend: 'up', threshold: 90, status: 'success' },
            { name: 'Tone Consistency', value: '93.7', unit: '%', trend: 'flat', threshold: 90, status: 'success' },
            { name: 'Generation Latency', value: '890', unit: 'ms', trend: 'flat', threshold: 1000, status: 'success' },
            { name: 'Token Efficiency', value: '88.2', unit: '%', trend: 'up', threshold: 85, status: 'success' },
            { name: 'User Satisfaction', value: '4.7', unit: '/5', trend: 'up', threshold: 4.5, status: 'success' },
        ]
    },
    {
        id: 'system',
        name: 'System Layer',
        subtext: 'Layer 3.7',
        icon: Cpu,
        description: 'Ensures reliability, performance, and ROI.',
        status: 'Active',
        color: 'from-slate-500/20 to-zinc-500/20',
        borderColor: 'border-slate-500/30',
        metrics: [
            { name: 'End-to-End Latency', value: '1.24', unit: 's', trend: 'flat', threshold: 2, status: 'success' },
            { name: 'Cost per Run', value: '$0.018', unit: '', trend: 'down', threshold: 0.05, status: 'success' },
            { name: 'System Uptime', value: '99.97', unit: '%', trend: 'flat', threshold: 99.9, status: 'success' },
            { name: 'Throughput', value: '245', unit: 'req/min', trend: 'up', threshold: 200, status: 'success' },
            { name: 'Error Rate', value: '0.12', unit: '%', trend: 'down', threshold: 0.5, status: 'success' },
            { name: 'Resource Utilization', value: '72.3', unit: '%', trend: 'flat', threshold: 85, status: 'success' },
            { name: 'Cache Hit Rate', value: '84.6', unit: '%', trend: 'up', threshold: 80, status: 'success' },
            { name: 'ROI Score', value: '8.9', unit: '/10', trend: 'up', threshold: 7, status: 'success' },
        ]
    }
];

// Metric status helper
const getMetricStatusColor = (status: string) => {
    switch (status) {
        case 'success':
            return 'text-green-500';
        case 'warning':
            return 'text-yellow-500';
        case 'error':
            return 'text-red-500';
        default:
            return 'text-muted-foreground';
    }
};

const getMetricStatusIcon = (status: string) => {
    switch (status) {
        case 'success':
            return CheckCircle2;
        case 'warning':
            return AlertCircle;
        case 'error':
            return AlertCircle;
        default:
            return Clock;
    }
};

export default function RunDetailedMetricPage() {
    const [selectedLayerId, setSelectedLayerId] = useState<string>('input');

    const handleLayerClick = (id: string) => {
        setSelectedLayerId(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            {/* Left Sidebar Menu */}
            <div className="w-72 border-r border-border bg-card/50 backdrop-blur-sm overflow-y-auto p-4 space-y-2 hidden md:block">
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-1 px-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Agent Layers
                    </h2>
                    <p className="text-xs text-muted-foreground px-2">7 evaluation layers</p>
                </div>
                {layers.map((layer) => (
                    <motion.button
                        key={layer.id}
                        onClick={() => handleLayerClick(layer.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${selectedLayerId === layer.id
                            ? 'bg-primary/10 text-primary shadow-md border border-primary/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                            }`}
                    >
                        <div className={`p-1.5 rounded-md ${selectedLayerId === layer.id ? 'bg-primary/20' : 'bg-muted'}`}>
                            <layer.icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                            <span className="text-sm font-semibold">{layer.name}</span>
                            <span className="text-[10px] opacity-70 font-mono">{layer.subtext}</span>
                        </div>
                        {selectedLayerId === layer.id && (
                            <motion.div
                                layoutId="active-indicator"
                                className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                            />
                        )}
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedLayerId === layer.id ? 'rotate-90' : ''}`} />
                    </motion.button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                    Layer Metrics Dashboard
                                </h1>
                                <p className="text-muted-foreground">
                                    Real-time evaluation metrics across all 7 agent layers • Run ID: <span className="font-mono text-primary">eval_2026_02_05_001</span>
                                </p>
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                                All Systems Active
                            </Badge>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                                    <p className="text-2xl font-bold text-blue-500">96.8%</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                                    <p className="text-2xl font-bold text-green-500">98.2%</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                                    <p className="text-2xl font-bold text-purple-500">1.24s</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground mb-1">Cost/Run</p>
                                    <p className="text-2xl font-bold text-orange-500">$0.018</p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Layer Cards Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {layers.map((layer, index) => (
                            <motion.div
                                id={layer.id}
                                key={layer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`col-span-1 ${selectedLayerId === layer.id ? 'md:col-span-2 lg:col-span-3' : ''}`}
                            >
                                <Card
                                    className={`h-full hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br ${layer.color} backdrop-blur-sm border ${layer.borderColor} ${selectedLayerId === layer.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                                        }`}
                                    onClick={() => setSelectedLayerId(layer.id)}
                                >
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                                className={`p-2.5 rounded-xl bg-gradient-to-br ${layer.color} border ${layer.borderColor}`}
                                            >
                                                <layer.icon className="w-6 h-6 text-primary" />
                                            </motion.div>
                                            <div>
                                                <CardTitle className="text-lg font-bold leading-tight">
                                                    {layer.name}
                                                </CardTitle>
                                                <p className="text-xs text-primary font-mono mt-1 font-semibold">{layer.subtext}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                            {layer.status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                                            {layer.description}
                                        </p>

                                        <AnimatePresence mode="wait">
                                            {selectedLayerId === layer.id ? (
                                                // Expanded view - show all metrics
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                                >
                                                    {layer.metrics.map((metric, idx) => {
                                                        const StatusIcon = getMetricStatusIcon(metric.status);
                                                        return (
                                                            <motion.div
                                                                key={metric.name}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-md"
                                                            >
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider line-clamp-2 flex-1">
                                                                        {metric.name}
                                                                    </p>
                                                                    <StatusIcon className={`w-3 h-3 ${getMetricStatusColor(metric.status)} flex-shrink-0 ml-1`} />
                                                                </div>
                                                                <div className="flex items-end justify-between mt-3">
                                                                    <div className="flex items-baseline gap-1">
                                                                        <span className="text-2xl font-bold">{metric.value}</span>
                                                                        <span className="text-xs text-muted-foreground">{metric.unit}</span>
                                                                    </div>
                                                                    {metric.trend === 'up' ? (
                                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                                    ) : metric.trend === 'down' ? (
                                                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                                                    ) : (
                                                                        <Minus className="w-4 h-4 text-muted-foreground/50" />
                                                                    )}
                                                                </div>
                                                                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${parseFloat(metric.value) > 10 ? Math.min(parseFloat(metric.value), 100) : parseFloat(metric.value) * 20}%` }}
                                                                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                                                                        className={`h-full ${metric.status === 'success' ? 'bg-green-500' : metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </motion.div>
                                            ) : (
                                                // Collapsed view - show first 4 metrics
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="grid grid-cols-2 gap-3"
                                                >
                                                    {layer.metrics.slice(0, 4).map((metric) => (
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
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {selectedLayerId !== layer.id && layer.metrics.length > 4 && (
                                            <p className="text-xs text-muted-foreground text-center mt-4">
                                                +{layer.metrics.length - 4} more metrics • Click to expand
                                            </p>
                                        )}
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
