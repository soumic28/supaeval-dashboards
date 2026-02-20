import { Button } from '@/components/ui/Button';
import { Filter, Download, Columns, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Copy, X, Calendar, User, Hash, Clock, CircleDollarSign, Fingerprint, Activity, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const generateMockDetails = (id: string, isAdvanced: boolean = false) => {
    const base = {
        service: "search-service-v2",
        kubernetesPod: `search-service-v2-${id.slice(3, 10)}-ghmxx`,
        latency: (Math.random() * 2 + 0.1).toFixed(2) + "s",
        cost: "$" + (Math.random() * 0.05).toFixed(4),
        tokens: {
            prompt: Math.floor(Math.random() * 1000) + 50,
            completion: Math.floor(Math.random() * 500) + 10,
            total: 0
        },
        user_id: `user_${Math.random().toString(36).substring(7)}`,
        session_id: `sess_${Math.random().toString(36).substring(7)}`,
        tags: ["production", "search", isAdvanced ? "high-priority" : "standard"],
        observations: [
            {
                id: `span_${Math.random().toString(36).substring(7)}`,
                type: "Span",
                name: "Router",
                startTime: "11:32:04.100",
                duration: "45ms",
                status: "Success",
                input: { route: "/search" }
            },
            {
                id: `gen_${Math.random().toString(36).substring(7)}`,
                type: "Generation",
                name: "LLM Completion",
                startTime: "11:32:04.145",
                duration: "2.1s",
                status: "Success",
                model: "gpt-4-turbo",
                tokens: 450,
                input: { messages: [{ role: "user", content: "Search for..." }] },
                output: { text: "Here are the results..." }
            },
            {
                id: `span_${Math.random().toString(36).substring(7)}`,
                type: "Span",
                name: "Database Vector Search",
                startTime: "11:32:06.245",
                duration: "300ms",
                status: "Success",
                input: { query_vector: "[0.12, -0.44, ...]" },
                output: { results_count: 5 }
            }
        ],
        logs: {
            "level": "debug",
            "timestamp": "2026-02-18T11:14:53.717626Z",
            "CloudProvider": "oci",
            "Environment": "dev",
            "RequestId": `req_${id}`,
        },
        input: {
            "domain_name": "ai.supavisa.com",
            "agent_name": "supervisor_agent",
            "query": "What is the status of my latest evaluation?"
        },
        output: {
            "response": "Your latest evaluation run finished successfully with a unified score of 92%.",
            "sources": ["db.eval_runs"]
        }
    };
    base.tokens.total = base.tokens.prompt + base.tokens.completion;
    return base;
};

// Generate 32 mock traces for pagination
const mockTraces = Array.from({ length: 32 }).map((_, i) => {
    const id = `tr-${Math.random().toString(16).slice(2, 10)}`;
    const isAdvanced = i % 3 === 0;
    const names = ['Evaluation Query', 'Search Request', 'Chat Completion', 'Metrics Analysis', 'Router Span', 'Agent Step'];
    return {
        id: id + '...',
        name: names[i % names.length],
        request: '{"domain_name": "ai...", "agent_name": "supervisor..."}',
        response: 'null',
        requestTime: `11/30/2025, 07:${30 + (i % 30)}:${10 + i}`,
        state: i % 7 === 0 ? 'Error' : 'OK',
        details: generateMockDetails(id, isAdvanced)
    };
});

const TracesPage = () => {
    const [traces] = useState(mockTraces);
    const [selectedTrace, setSelectedTrace] = useState<typeof mockTraces[0] | null>(null);
    const [activeTab, setActiveTab] = useState<'Overview' | 'Timeline' | 'Raw'>('Overview');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(traces.length / itemsPerPage);
    const paginatedTraces = traces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);

    return (
        <div className="relative flex h-[calc(100vh-8rem)] w-full overflow-hidden">
            <div className={cn(
                "space-y-6 flex-1 overflow-y-auto transition-all duration-300",
                selectedTrace ? "pr-[800px]" : "pr-0"
            )}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Traces</h1>
                        <p className="text-muted-foreground">Monitor and debug individual LLM requests and interactions.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" className="h-9">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                        <Button variant="outline" className="h-9">
                            <Columns className="w-4 h-4 mr-2" /> Columns
                        </Button>
                        <Button variant="outline" className="h-9">
                            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                        </Button>
                        <Button variant="outline" className="h-9">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex bg-muted rounded-md p-1">
                        <button className="px-3 py-1.5 text-sm font-medium bg-background shadow-sm rounded">Logs</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                            Charts <span className="text-[10px] bg-primary/10 text-primary px-1 rounded ml-1">Beta</span>
                        </button>
                    </div>
                    <div className="hidden lg:flex text-sm text-muted-foreground items-center gap-2">
                        <span>Time Range: Custom</span>
                        <span className="h-4 w-px bg-border"></span>
                        <span>Start: 20-11-2025 07:32</span>
                        <span>End: 18-02-2026 18:47</span>
                    </div>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-x-auto bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Trace ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">User ID</th>
                                <th className="px-6 py-3">Tokens</th>
                                <th className="px-6 py-3">Latency</th>
                                <th className="px-6 py-3">Request time</th>
                                <th className="px-6 py-3">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedTraces.map((trace, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelectedTrace(trace)}
                                    className={cn(
                                        "hover:bg-muted/80 transition-colors cursor-pointer",
                                        selectedTrace?.id === trace.id ? "bg-muted/80" : ""
                                    )}
                                >
                                    <td className="px-6 py-4 font-mono text-xs text-primary max-w-[120px] truncate" title={trace.id}>{trace.id}</td>
                                    <td className="px-6 py-4 font-medium text-foreground">{trace.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{trace.details.user_id}</td>
                                    <td className="px-6 py-4 text-xs">{trace.details.tokens.total}</td>
                                    <td className="px-6 py-4 text-xs">{trace.details.latency}</td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">{trace.requestTime}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 text-xs font-medium",
                                            trace.state === 'Error' ? "text-destructive" : "text-green-500"
                                        )}>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {trace.state}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                        <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, traces.length)} of {traces.length} results</span>
                        <div className="h-4 w-px bg-border mx-2"></div>
                        <span className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Delta sync: Enabled
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={handleFirstPage} disabled={currentPage === 1}>
                            <ChevronsLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={handlePrevPage} disabled={currentPage === 1}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center justify-center min-w-[3rem] px-2 font-medium text-foreground">
                            {currentPage} / {totalPages}
                        </div>

                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={handleLastPage} disabled={currentPage === totalPages}>
                            <ChevronsRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Slide-out Sidebar - Advanced Langfuse Style */}
            <div className={cn(
                "fixed top-16 right-0 bottom-0 w-[800px] max-w-[100vw] bg-background border-l shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
                selectedTrace ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedTrace && (
                    <>
                        {/* Sidebar Header */}
                        <div className="p-4 border-b flex flex-col gap-3 bg-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-semibold">{selectedTrace.name}</h2>
                                        <Badge variant="outline" className={selectedTrace.state === 'Error' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                                            {selectedTrace.state}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> {selectedTrace.requestTime}
                                        <span className="text-border">|</span>
                                        <Hash className="w-3 h-3" /> {selectedTrace.id}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="h-4 w-px bg-border mx-1" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setSelectedTrace(null)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium text-foreground">{selectedTrace.details.latency}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <CircleDollarSign className="w-4 h-4" />
                                    <span className="font-medium text-foreground">{selectedTrace.details.cost}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Activity className="w-4 h-4" />
                                    <span className="font-medium text-foreground">{selectedTrace.details.tokens.total} tokens</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-4 border-b bg-card">
                            <div className="flex items-center gap-6">
                                {(['Overview', 'Timeline', 'Raw'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "py-3 text-sm font-medium border-b-2 transition-colors relative top-[1px]",
                                            activeTab === tab
                                                ? "border-primary text-foreground"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Body */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 text-sm bg-muted/10">

                            {/* OVERVIEW TAB */}
                            {activeTab === 'Overview' && (
                                <div className="space-y-6">
                                    {/* Metadata Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-card border rounded-lg p-3 space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="w-3 h-3" /> User ID</p>
                                            <p className="font-mono text-xs truncate" title={selectedTrace.details.user_id}>{selectedTrace.details.user_id}</p>
                                        </div>
                                        <div className="bg-card border rounded-lg p-3 space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Session ID</p>
                                            <p className="font-mono text-xs truncate" title={selectedTrace.details.session_id}>{selectedTrace.details.session_id}</p>
                                        </div>
                                        <div className="bg-card border rounded-lg p-3 space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">Tokens (P/C)</p>
                                            <p className="font-mono text-xs truncate">{selectedTrace.details.tokens.prompt} / {selectedTrace.details.tokens.completion}</p>
                                        </div>
                                        <div className="bg-card border rounded-lg p-3 space-y-1">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedTrace.details.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input / Output */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold flex items-center gap-2">Input <Badge variant="outline" className="font-normal text-[10px]">JSON</Badge></h3>
                                            <div className="bg-card border rounded-md p-4 overflow-x-auto text-xs font-mono">
                                                <pre className="text-blue-600 dark:text-blue-400">
                                                    {JSON.stringify(selectedTrace.details.input, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold flex items-center gap-2">Output <Badge variant="outline" className="font-normal text-[10px]">JSON</Badge></h3>
                                            <div className="bg-card border rounded-md p-4 overflow-x-auto text-xs font-mono">
                                                <pre className="text-green-600 dark:text-green-400">
                                                    {JSON.stringify(selectedTrace.details.output, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TIMELINE TAB */}
                            {activeTab === 'Timeline' && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold mb-4">Observations Timeline</h3>
                                    <div className="relative border-l-2 border-border ml-3 pl-6 space-y-6">
                                        {selectedTrace.details.observations.map((obs, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[31px] bg-background border-2 border-primary rounded-full w-4 h-4 mt-0.5" />
                                                <div className="bg-card border rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={obs.type === 'Generation' ? 'default' : 'secondary'} className="text-[10px]">
                                                                {obs.type}
                                                            </Badge>
                                                            <span className="font-semibold">{obs.name}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                                                            {obs.startTime}
                                                            <Badge variant="outline" className="text-[10px] font-normal">{obs.duration}</Badge>
                                                        </div>
                                                    </div>

                                                    {obs.tokens && (
                                                        <p className="text-xs text-muted-foreground mb-3">Tokens: {obs.tokens}</p>
                                                    )}

                                                    <div className="space-y-2 mt-3">
                                                        {obs.input && (
                                                            <div className="bg-muted/50 rounded p-2 text-[11px] font-mono overflow-x-auto">
                                                                <span className="text-muted-foreground select-none">Input: </span>
                                                                {JSON.stringify(obs.input)}
                                                            </div>
                                                        )}
                                                        {obs.output && (
                                                            <div className="bg-muted/50 rounded p-2 text-[11px] font-mono overflow-x-auto">
                                                                <span className="text-muted-foreground select-none">Output: </span>
                                                                {JSON.stringify(obs.output)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* RAW TAB */}
                            {activeTab === 'Raw' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Raw Trace Log</h3>
                                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedTrace.details, null, 2))}>
                                            <Copy className="w-3 h-3 mr-1" /> Copy All
                                        </Button>
                                    </div>
                                    <div className="bg-card border rounded-md p-4 overflow-x-auto text-xs font-mono">
                                        <pre className="text-foreground">
                                            {JSON.stringify(selectedTrace.details, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TracesPage;
