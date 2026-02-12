import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { X, ChevronRight, ChevronDown, Hammer, Search, Activity, Copy, Play, Check, Brain, Database, MessageSquare, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

// --- REFACORTED MOCK DATA ---

interface TraceSpan {
    id: string;
    name: string;
    type: 'layer' | 'step' | 'llm' | 'tool' | 'retriever' | 'memory' | 'system';
    layerType?: 'input' | 'planning' | 'retrieval' | 'memory' | 'tool' | 'generation' | 'system';
    startTime: number;
    duration: number;
    status: 'success' | 'error' | 'pending';
    children?: TraceSpan[];
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    metadata?: Record<string, any>;
}

const generateMockTrace = (promptId: string): TraceSpan => {
    return {
        id: `root-${promptId}`,
        name: 'Evaluation Run',
        type: 'system',
        startTime: 0,
        duration: 4.25,
        status: 'success',
        inputs: { query: 'Book a flight to NYC for next Tuesday, under $500' },
        outputs: { final_response: 'I found 2 flights under $500...' },
        children: [
            {
                id: 'layer_1_input',
                name: '1. Input & Intent Layer',
                type: 'layer',
                layerType: 'input',
                startTime: 0.1,
                duration: 0.15,
                status: 'success',
                inputs: { query: 'Book a flight to NYC for next Tuesday, under $500' },
                outputs: {
                    intent: 'BookFlight',
                    entities: { destination: 'NYC', date: 'next Tuesday', max_price: 500 },
                    safety_check: 'PASS'
                },
                children: [
                    {
                        id: 'l1_step_1',
                        name: 'Intent Classifier',
                        type: 'llm',
                        startTime: 0.1,
                        duration: 0.1,
                        status: 'success',
                        inputs: { model: 'gpt-4o-mini', prompt: 'Classify intent...' },
                        outputs: { intent: 'BookFlight', confidence: 0.98 }
                    },
                    {
                        id: 'l1_step_2',
                        name: 'Guardrails Check',
                        type: 'step',
                        startTime: 0.2,
                        duration: 0.05,
                        status: 'success',
                        inputs: { text: 'Book a flight...' },
                        outputs: { flagged: false }
                    }
                ]
            },
            {
                id: 'layer_2_planning',
                name: '2. Planning & Reasoning Layer',
                type: 'layer',
                layerType: 'planning',
                startTime: 0.3,
                duration: 0.45,
                status: 'success',
                inputs: { intent: 'BookFlight', entities: { destination: 'NYC', date: '2024-05-21' } },
                outputs: {
                    plan_id: 'plan_af32',
                    steps: ['search_flights', 'check_availability', 'confirm_booking']
                },
                children: [
                    {
                        id: 'l2_step_1',
                        name: 'Planner Agent',
                        type: 'llm',
                        startTime: 0.3,
                        duration: 0.4,
                        status: 'success',
                        inputs: { task: 'BookFlight', context: '...' },
                        outputs: { plan: '1. Search Flights\n2. Filter by Price...' }
                    }
                ]
            },
            {
                id: 'layer_3_retrieval',
                name: '3. Retrieval & Context Layer',
                type: 'layer',
                layerType: 'retrieval',
                startTime: 0.8,
                duration: 0.3,
                status: 'success',
                inputs: { queries: ['flights to NYC', 'user preferences'] },
                outputs: {
                    docs: ['doc_123', 'doc_456'],
                    context_window_usage: '12%'
                },
                children: [
                    {
                        id: 'l3_step_1',
                        name: 'Vector Search',
                        type: 'retriever',
                        startTime: 0.8,
                        duration: 0.2,
                        status: 'success',
                        inputs: { collection: 'travel_docs', top_k: 5 },
                        outputs: { matches: 3, scores: [0.92, 0.88, 0.85] }
                    }
                ]
            },
            {
                id: 'layer_4_memory',
                name: '4. Memory Layer',
                type: 'layer',
                layerType: 'memory',
                startTime: 1.15,
                duration: 0.1,
                status: 'success',
                inputs: { session_id: 'sess_123' },
                outputs: {
                    short_term: { last_search: 'hotels in SF' },
                    long_term: { loyalty_program: 'Gold' }
                },
                children: []
            },
            {
                id: 'layer_5_tool',
                name: '5. Tool & Action Layer',
                type: 'layer',
                layerType: 'tool',
                startTime: 1.3,
                duration: 1.5,
                status: 'success',
                inputs: { tool: 'FlightAPI', action: 'search' },
                outputs: { status: 200, data: { flights: [{ id: 'DL123', price: 450 }] } },
                children: [
                    {
                        id: 'l5_step_1',
                        name: 'FlightAPI.search',
                        type: 'tool',
                        startTime: 1.3,
                        duration: 1.4,
                        status: 'success',
                        inputs: { origin: 'SFO', dest: 'NYC', date: '2024-05-21' },
                        outputs: { results: 15, latency: '1.4s' }
                    }
                ]
            },
            {
                id: 'layer_6_generation',
                name: '6. Generation Layer',
                type: 'layer',
                layerType: 'generation',
                startTime: 2.9,
                duration: 0.8,
                status: 'success',
                inputs: { context: 'User prefers aisle seat', tool_results: 'Found 2 flights' },
                outputs: { response: 'I found 2 flights...' },
                children: [
                    {
                        id: 'l6_step_1',
                        name: 'Response Synthesizer',
                        type: 'llm',
                        startTime: 2.9,
                        duration: 0.8,
                        status: 'success',
                        inputs: { prompt: 'Generate friendly response...' },
                        outputs: { tokens: 145, finish_reason: 'stop' }
                    }
                ]
            },
            {
                id: 'layer_7_system',
                name: '7. System Layer',
                type: 'layer',
                layerType: 'system',
                startTime: 3.8,
                duration: 0.05,
                status: 'success',
                inputs: { trace_id: 'tr_889' },
                outputs: {
                    total_tokens: 450,
                    cost: 0.012,
                    latency: 4.25
                },
                children: []
            }
        ]
    };
};

// --- COMPONENTS ---

const SpanIcon = ({ type, layerType }: { type: TraceSpan['type'], layerType?: TraceSpan['layerType'] }) => {
    // If it's a layer, use specific icons
    if (type === 'layer') {
        switch (layerType) {
            case 'input': return <Activity className="w-4 h-4 text-blue-500" />;
            case 'planning': return <Brain className="w-4 h-4 text-purple-500" />;
            case 'retrieval': return <Search className="w-4 h-4 text-green-500" />;
            case 'memory': return <Database className="w-4 h-4 text-orange-500" />;
            case 'tool': return <Hammer className="w-4 h-4 text-red-500" />;
            case 'generation': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
            case 'system': return <Cpu className="w-4 h-4 text-slate-500" />;
            default: return <Activity className="w-4 h-4" />;
        }
    }

    // Fallback for steps inside layers
    switch (type) {
        case 'llm': return <Brain className="w-3.5 h-3.5" />;
        case 'tool': return <Hammer className="w-3.5 h-3.5" />;
        case 'retriever': return <Search className="w-3.5 h-3.5" />;
        case 'step': return <Check className="w-3.5 h-3.5" />;
        default: return <Activity className="w-3.5 h-3.5" />;
    }
};

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copy">
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
        </Button>
    );
};

const TreeItem = ({
    span,
    level = 0,
    isLast = false,
    selectedId,
    onSelect
}: {
    span: TraceSpan;
    level?: number;
    isLast?: boolean;
    selectedId: string | null;
    onSelect: (span: TraceSpan) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = span.children && span.children.length > 0;
    const isSelected = selectedId === span.id;

    // Determine colors based on selection and type
    const getCardStyles = () => {
        if (isSelected) {
            // Selected: Blue border/glow, different background
            return 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500 shadow-md z-10';
        }
        // Default: specific background for contrast in dark mode
        return 'bg-card dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-muted/50 shadow-sm';
    };

    const getIconClasses = () => {
        if (isSelected) return 'text-blue-600 dark:text-blue-400';
        if (isSelected) return 'text-blue-600 dark:text-blue-400';
        if (span.type === 'layer') {
            switch (span.layerType) {
                case 'input': return 'text-blue-500';
                case 'planning': return 'text-purple-500';
                case 'retrieval': return 'text-green-500';
                case 'memory': return 'text-orange-500';
                case 'tool': return 'text-red-500';
                case 'generation': return 'text-indigo-500';
                case 'system': return 'text-slate-500';
                default: return 'text-foreground';
            }
        }
        return 'text-muted-foreground';
    };

    return (
        <div className="relative">
            {/* Connection Lines */}
            {level > 0 && (
                <>
                    <div className={`absolute -left-[19px] top-0 w-[19px] h-[24px] border-b border-l rounded-bl-xl border-slate-300 dark:border-slate-600`} />
                    {!isLast && <div className="absolute -left-[19px] top-[24px] bottom-0 w-px bg-slate-300 dark:bg-slate-600" />}
                </>
            )}

            <div
                className="group flex items-center py-1.5 cursor-pointer select-none"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(span);
                }}
            >
                {/* Expand Toggle */}
                <div className="w-5 h-5 flex items-center justify-center mr-1 shrink-0 z-10">
                    {hasChildren ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className="p-0.5 hover:bg-muted rounded text-muted-foreground transition-transform active:scale-95"
                        >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                    ) : <div className="w-3 h-3" />}
                </div>

                {/* Node Card */}
                <div className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-200 flex-1 min-w-0 relative
                    ${getCardStyles()}
                `}>
                    <div className={`shrink-0 ${getIconClasses()}`}>
                        <SpanIcon type={span.type} layerType={span.layerType} />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <span className={`text-sm font-medium truncate leading-tight ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground/90'}`}>
                            {span.name}
                        </span>
                        {span.type === 'llm' && span.inputs?.prompt && (
                            <span className="text-[10px] text-muted-foreground truncate opacity-70 mt-0.5 font-mono">
                                {span.inputs.prompt.substring(0, 40)}...
                            </span>
                        )}
                    </div>

                    <span className={`
                        text-[10px] font-mono px-1.5 py-0.5 rounded border ml-2 shrink-0
                        ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300' : 'bg-muted/50 text-muted-foreground border-border/50'}
                    `}>
                        {span.duration.toFixed(2)}s
                    </span>
                </div>
            </div>

            {/* Children */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative ml-[19px]"
                    >
                        <div className="pt-0">
                            {span.children!.map((child, index) => (
                                <TreeItem
                                    key={child.id}
                                    span={child}
                                    level={level + 1}
                                    isLast={index === span.children!.length - 1}
                                    selectedId={selectedId}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-muted/10 hover:bg-muted/20 transition-colors text-left"
            >
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <span className="font-semibold text-sm">{title}</span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MODAL ---

interface TraceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    promptId: string | null;
}

export function TraceDetailModal({ isOpen, onClose, promptId }: TraceDetailModalProps) {
    if (!isOpen) return null;

    const traceData = useMemo(() => promptId ? generateMockTrace(promptId) : null, [promptId]);
    const [selectedSpan, setSelectedSpan] = useState<TraceSpan | null>(null);
    const [activeTab, setActiveTab] = useState('Inputs / Outputs');

    useMemo(() => {
        if (traceData && !selectedSpan) setSelectedSpan(traceData);
    }, [traceData]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-background w-full h-full max-w-[1600px] max-h-[90vh] border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-border/50">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-none">Trace Details</h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-sm">ID: {promptId}</span>
                                <Badge variant="outline" className="text-[10px] h-5 border-green-200 bg-green-50 text-green-700 gap-1 pl-1 pr-2">
                                    <Check className="w-3 h-3" /> Success
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT PANE: Tree View */}
                    <div className="w-[35%] min-w-[320px] max-w-[500px] border-r flex flex-col bg-slate-50/50 dark:bg-black/20">
                        <div className="p-4 border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="w-full bg-background border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                                    placeholder="Filter execution steps..."
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {traceData && (
                                <div className="pl-1">
                                    <TreeItem
                                        span={traceData}
                                        level={0}
                                        selectedId={selectedSpan?.id || null}
                                        onSelect={setSelectedSpan}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANE: Details */}
                    <div className="flex-1 flex flex-col bg-background relative z-0">
                        {selectedSpan ? (
                            <div className="flex flex-col h-full">
                                {/* Header / Tabs */}
                                <div className="px-6 border-b flex items-center justify-between bg-card min-h-[57px]">
                                    <div className="flex items-center gap-6 h-full">
                                        {['Inputs / Outputs'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`
                                                    h-[57px] text-sm font-medium border-b-2 transition-colors px-1
                                                    ${activeTab === tab
                                                        ? 'border-blue-500 text-foreground font-semibold'
                                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                                    }
                                                `}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                                            {selectedSpan.duration.toFixed(3)}s
                                        </Badge>
                                        <Button size="sm" variant="outline" className="gap-2 h-8">
                                            <Activity className="w-3.5 h-3.5" />
                                            Assessments
                                        </Button>
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
                                    <div className="p-6 max-w-4xl mx-auto space-y-6">

                                        {activeTab === 'Inputs / Outputs' && (
                                            <>
                                                {/* INPUTS SECTION */}
                                                <CollapsibleSection title="Inputs" defaultOpen>
                                                    <div className="space-y-4">
                                                        {Object.entries(selectedSpan.inputs || {}).length > 0 ? (
                                                            Object.entries(selectedSpan.inputs || {}).map(([key, value]) => (
                                                                <div key={key} className="border rounded-lg bg-card shadow-sm overflow-hidden">
                                                                    <div className="px-4 py-2 border-b bg-muted/20 flex justify-between items-center">
                                                                        <span className="text-xs font-semibold text-muted-foreground font-mono">{key}</span>
                                                                        <CopyButton text={JSON.stringify(value)} />
                                                                    </div>
                                                                    <div className="relative">
                                                                        <textarea
                                                                            className="w-full min-h-[120px] p-4 font-mono text-xs resize-y focus:outline-none bg-transparent leading-relaxed text-slate-700 dark:text-slate-300"
                                                                            defaultValue={JSON.stringify(value, null, 2)}
                                                                            spellCheck={false}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-muted-foreground italic px-2">No inputs available</div>
                                                        )}

                                                        <div className="flex justify-end pt-2">
                                                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200">
                                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                                Run
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CollapsibleSection>

                                                {/* OUTPUTS SECTION */}
                                                <CollapsibleSection title="Outputs" defaultOpen>
                                                    <div className="space-y-4">
                                                        {Object.entries(selectedSpan.outputs || {}).length > 0 ? (
                                                            Object.entries(selectedSpan.outputs || {}).map(([key, value]) => (
                                                                <div key={key} className="border rounded-lg bg-card shadow-sm overflow-hidden">
                                                                    <div className="px-4 py-2 border-b bg-muted/20 flex justify-between items-center">
                                                                        <span className="text-xs font-semibold text-muted-foreground font-mono">{key}</span>
                                                                        <CopyButton text={JSON.stringify(value)} />
                                                                    </div>
                                                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/30 overflow-x-auto">
                                                                        <pre className="font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                                            {JSON.stringify(value, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-muted-foreground italic px-2">No outputs available</div>
                                                        )}
                                                    </div>
                                                </CollapsibleSection>
                                            </>
                                        )}


                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Activity className="w-8 h-8 opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground">Select a Trace Step</h3>
                                <p className="text-sm max-w-[250px] mt-2">Click on any step in the execution tree on the left to view details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
