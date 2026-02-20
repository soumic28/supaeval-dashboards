import { Button } from '@/components/ui/Button';
import { Filter, Download, Columns as ColumnsIcon, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Copy, X, Calendar, User, Hash, Clock, CircleDollarSign, Fingerprint, Activity, ChevronsLeft, ChevronsRight, BarChart3, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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

// Generate 32 mock traces
const generateInitialTraces = () => Array.from({ length: 32 }).map((_, i) => {
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
    const [traces, setTraces] = useState(generateInitialTraces());
    const [selectedTrace, setSelectedTrace] = useState<typeof traces[0] | null>(null);
    const [activeTab, setActiveTab] = useState<'Overview' | 'Timeline' | 'Raw'>('Overview');

    // Header Actions State
    const [viewMode, setViewMode] = useState<'logs' | 'charts'>('logs');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filter State
    const [statusFilter, setStatusFilter] = useState<'All' | 'OK' | 'Error'>('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Columns State
    const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        userId: true,
        tokens: true,
        latency: true,
        requestTime: true,
        state: true
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Apply filters
    const filteredTraces = traces.filter(t => statusFilter === 'All' || t.state === statusFilter);
    const totalPages = Math.ceil(filteredTraces.length / itemsPerPage);
    const paginatedTraces = filteredTraces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page to 1 if filter changes
    useEffect(() => { setCurrentPage(1) }, [statusFilter]);

    // Handlers
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setTraces([...generateInitialTraces()]); // shuffle data
            setIsRefreshing(false);
        }, 800);
    };

    const handleExport = () => {
        const headers = ['Trace ID', 'Name', 'User ID', 'Tokens', 'Latency', 'Request Time', 'State'].join(',');
        const rows = traces.map(t =>
            `"${t.id}","${t.name}","${t.details.user_id}","${t.details.tokens.total}","${t.details.latency}","${t.requestTime}","${t.state}"`
        ).join('\n');

        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `traces_export_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const toggleColumn = (key: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <Button
                                variant={statusFilter !== 'All' ? 'default' : 'outline'}
                                className="h-9 relative"
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            >
                                <Filter className="w-4 h-4 mr-2" /> Filter
                                {statusFilter !== 'All' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>}
                            </Button>
                            {showFilterDropdown && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowFilterDropdown(false)}></div>
                                    <div className="absolute right-0 mt-2 w-40 bg-card border rounded-md shadow-lg z-40 p-1">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Status</div>
                                        {['All', 'OK', 'Error'].map(opt => (
                                            <button
                                                key={opt}
                                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm flex items-center justify-between"
                                                onClick={() => { setStatusFilter(opt as any); setShowFilterDropdown(false); }}
                                            >
                                                {opt}
                                                {statusFilter === opt && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Columns Dropdown */}
                        <div className="relative">
                            <Button variant="outline" className="h-9" onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}>
                                <ColumnsIcon className="w-4 h-4 mr-2" /> Columns
                            </Button>
                            {showColumnsDropdown && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowColumnsDropdown(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg z-40 p-1">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Toggle Columns</div>
                                        {Object.entries({
                                            id: 'Trace ID', name: 'Name', userId: 'User ID',
                                            tokens: 'Tokens', latency: 'Latency', requestTime: 'Request Time', state: 'State'
                                        }).map(([key, label]) => (
                                            <button
                                                key={key}
                                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm flex items-center gap-2"
                                                onClick={() => toggleColumn(key as any)}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 border rounded flex items-center justify-center",
                                                    visibleColumns[key as keyof typeof visibleColumns] ? "bg-primary border-primary text-primary-foreground" : "border-input"
                                                )}>
                                                    {visibleColumns[key as keyof typeof visibleColumns] && <Check className="w-3 h-3" />}
                                                </div>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <Button variant="outline" className="h-9" onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} /> Refresh
                        </Button>
                        <Button variant="outline" className="h-9" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex bg-muted rounded-md p-1 relative">
                        <div className={cn(
                            "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background shadow-sm rounded transition-all duration-200 pointer-events-none",
                            viewMode === 'logs' ? "left-1" : "left-[calc(50%+4px)]"
                        )}></div>
                        <button
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium relative z-10 rounded transition-colors w-24",
                                viewMode === 'logs' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setViewMode('logs')}
                        >
                            Logs
                        </button>
                        <button
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium relative z-10 rounded transition-colors flex items-center justify-center gap-1.5 w-24",
                                viewMode === 'charts' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setViewMode('charts')}
                        >
                            Charts <span className="text-[10px] bg-primary/10 text-primary px-1 rounded">Beta</span>
                        </button>
                    </div>
                    <div className="hidden lg:flex text-sm text-muted-foreground items-center gap-2">
                        <span>Time Range: Custom</span>
                        <span className="h-4 w-px bg-border"></span>
                        <span>Start: 20-11-2025 07:32</span>
                        <span>End: 18-02-2026 18:47</span>
                    </div>
                </div>

                {/* Dynamic Content Area (Logs vs Charts) */}
                {viewMode === 'charts' ? (
                    <div className="border rounded-lg bg-card p-8 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Analytics Dashboards <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">Beta</Badge></h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                            Visualize trace distributions, latency percentiles, and cost analytics over time. This feature is currently in active development.
                        </p>
                        <Button variant="default" onClick={() => setViewMode('logs')}>Return to Logs</Button>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="border rounded-lg overflow-x-auto bg-card relative min-h-[400px]">
                            {isRefreshing && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            )}
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium sticky top-0 z-10">
                                    <tr>
                                        {visibleColumns.id && <th className="px-6 py-3">Trace ID</th>}
                                        {visibleColumns.name && <th className="px-6 py-3">Name</th>}
                                        {visibleColumns.userId && <th className="px-6 py-3">User ID</th>}
                                        {visibleColumns.tokens && <th className="px-6 py-3">Tokens</th>}
                                        {visibleColumns.latency && <th className="px-6 py-3">Latency</th>}
                                        {visibleColumns.requestTime && <th className="px-6 py-3">Request time</th>}
                                        {visibleColumns.state && <th className="px-6 py-3">State</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {paginatedTraces.length > 0 ? (
                                        paginatedTraces.map((trace, i) => (
                                            <tr
                                                key={i}
                                                onClick={() => setSelectedTrace(trace)}
                                                className={cn(
                                                    "hover:bg-muted/80 transition-colors cursor-pointer",
                                                    selectedTrace?.id === trace.id ? "bg-muted/80" : ""
                                                )}
                                            >
                                                {visibleColumns.id && <td className="px-6 py-4 font-mono text-xs text-primary max-w-[120px] truncate" title={trace.id}>{trace.id}</td>}
                                                {visibleColumns.name && <td className="px-6 py-4 font-medium text-foreground">{trace.name}</td>}
                                                {visibleColumns.userId && <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{trace.details.user_id}</td>}
                                                {visibleColumns.tokens && <td className="px-6 py-4 text-xs">{trace.details.tokens.total}</td>}
                                                {visibleColumns.latency && <td className="px-6 py-4 text-xs">{trace.details.latency}</td>}
                                                {visibleColumns.requestTime && <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">{trace.requestTime}</td>}
                                                {visibleColumns.state && (
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1.5 text-xs font-medium",
                                                            trace.state === 'Error' ? "text-destructive" : "text-green-500"
                                                        )}>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            {trace.state}
                                                        </span>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                                No traces found for the active filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
                            {filteredTraces.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTraces.length)} of {filteredTraces.length} results</span>
                                        {statusFilter !== 'All' && <Badge variant="secondary" className="ml-2">Filtered</Badge>}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                            <ChevronsLeft className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>

                                        <div className="flex items-center justify-center min-w-[3rem] px-2 font-medium text-foreground">
                                            {currentPage} / {totalPages}
                                        </div>

                                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                                            <ChevronsRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full text-center py-2">Adjust filters to see results.</div>
                            )}
                        </div>
                    </>
                )}
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
