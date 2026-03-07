import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Filter, Download, Columns as ColumnsIcon, RefreshCw, ChevronLeft, ChevronRight, Copy, X, Calendar, User, Hash, Clock, CircleDollarSign, Fingerprint, Activity, ChevronsLeft, ChevronsRight, Check, Search, ChevronDown, Zap, Thermometer, Coins, Layers, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/use-toast';

const generateMockDetails = (id: string, isAdvanced: boolean = false) => {
    const base = {
        service: "search-service-v2",
        kubernetesPod: `search-service-v2-${id.slice(3, 10)}-ghmxx`,
        latency: (Math.random() * 4).toFixed(2) + "s", // Increased range to test color coding
        cost: "$" + (Math.random() * 0.05).toFixed(4),
        model: isAdvanced ? "gpt-4-turbo" : "gpt-3.5-turbo",
        evalScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
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
                name: "Vector Retrieval",
                startTime: "11:32:04.100",
                duration: "450ms",
                status: "Success",
                input: { query: "semantic search query" },
                output: { matches: 12 }
            },
            {
                id: `gen_${Math.random().toString(36).substring(7)}`,
                type: "Generation",
                name: "LLM Completion",
                startTime: "11:32:04.550",
                duration: "2.1s",
                status: "Success",
                model: isAdvanced ? "gpt-4-turbo" : "gpt-3.5-turbo",
                tokens: 450,
                input: { messages: [{ role: "user", content: "Search for..." }] },
                output: { text: "Here are the results..." }
            },
            {
                id: `span_${Math.random().toString(36).substring(7)}`,
                type: "Span",
                name: "Reranking",
                startTime: "11:32:06.650",
                duration: "300ms",
                status: "Success",
                input: { items: 12 },
                output: { top_k: 5 }
            }
        ],
        logs: {
            "level": "debug",
            "timestamp": new Date().toISOString(),
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
            "response": id.startsWith('tr-massive')
                ? "A".repeat(110000) // Test massive payload
                : "Your latest evaluation run finished successfully with a unified score of 92%.",
            "sources": ["db.eval_runs"],
            "image_url": "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png" // Test image modality
        }
    };
    base.tokens.total = base.tokens.prompt + base.tokens.completion;
    return base;
};

// Generate 32 mock traces
const generateInitialTraces = () => Array.from({ length: 32 }).map((_, i) => {
    const id = i === 5 ? 'tr-massive-payload' : `tr-${Math.random().toString(16).slice(2, 10)}`;
    const isAdvanced = i % 3 === 0;
    const names = ['Evaluation Query', 'Search Request', 'Chat Completion', 'Metrics Analysis', 'Router Span', 'Agent Step'];

    const now = new Date();
    const daysAgo = i < 8 ? (Math.random() / 24) : i < 15 ? (Math.random()) : (Math.random() * 30);
    const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

    const details = generateMockDetails(id, isAdvanced);

    return {
        id: id,
        name: names[i % names.length],
        request: JSON.stringify(details.input),
        response: JSON.stringify(details.output),
        timestamp: date.getTime(),
        state: i % 7 === 0 ? 'Error' : 'OK',
        metric: details.evalScore,
        model: details.model,
        details: details
    };
});

const MetricCard = ({ title, value, subtext, icon: Icon, trend, trendValue, colorClass, gradient }: any) => (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-border/40 bg-card/50", gradient)}>
        <CardContent className="p-4 relative">
            <div className="flex justify-between items-start mb-3">
                <div className={cn("p-1.5 rounded-md bg-background/50 border border-border/40", colorClass)}>
                    <Icon className="w-4 h-4" />
                </div>
                {trend && (
                    <Badge variant="outline" className={cn(
                        "text-[9px] font-bold px-1 py-0 tracking-tight",
                        trend === 'up' ? "bg-green-500/10 text-green-600 border-green-200/50" : "bg-red-500/10 text-red-600 border-red-200/50"
                    )}>
                        {trendValue}
                    </Badge>
                )}
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{title}</p>
                <div className="flex items-baseline gap-1.5">
                    <p className="text-xl font-bold tracking-tight text-foreground leading-none">{value}</p>
                    {subtext && <p className="text-[10px] text-muted-foreground font-medium tracking-tight leading-none">{subtext}</p>}
                </div>
            </div>
        </CardContent>
    </Card>
);

const PayloadContent = ({ content, mode }: { content: any, mode: 'Pretty' | 'Raw' }) => {
    const isImage = (val: any) => typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:image'));
    const isMassive = (val: any) => typeof val === 'string' && val.length > 100000;

    const renderValue = (val: any) => {
        if (isImage(val)) {
            return (
                <div className="mt-2 group/img relative inline-block">
                    <img src={val} alt="Payload Modal" className="max-w-[200px] max-h-[150px] rounded-lg border shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                        <Badge className="bg-background/80 text-foreground backdrop-blur-sm">Click to Enlarge</Badge>
                    </div>
                </div>
            );
        }
        if (isMassive(val)) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 text-[11px] font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        Payload truncated (100k+ chars) to prevent browser instability.
                    </div>
                    <p className="text-muted-foreground italic font-mono text-[10px]">{val.substring(0, 500)}...</p>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">
                        <Download className="w-3 h-3 mr-1.5" /> Download Full Payload
                    </Button>
                </div>
            );
        }
        return typeof val === 'string' ? val : JSON.stringify(val, null, 2);
    };

    if (mode === 'Pretty') {
        return (
            <div className="space-y-4">
                {Object.entries(content).map(([key, val]) => (
                    <div key={key} className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{key}</span>
                        <div className="text-sm font-medium leading-relaxed bg-muted/20 border border-transparent hover:border-border/30 rounded-lg p-3 transition-colors">
                            {renderValue(val)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-muted/30 border border-border/40 rounded-lg p-4 overflow-x-auto text-[11px] font-mono leading-relaxed group/json relative">
            <pre className="text-foreground/90 dark:text-foreground/80 scrollbar-thin selection:bg-primary/20">
                {JSON.stringify(content, null, 2)}
            </pre>
        </div>
    );
};

const TracesPage = () => {
    const navigate = useNavigate();
    const [traces, setTraces] = useState(generateInitialTraces());
    const [selectedTrace, setSelectedTrace] = useState<typeof traces[0] | null>(null);
    const [selectedSpan, setSelectedSpan] = useState<any>(null);
    const [payloadViewMode, setPayloadViewMode] = useState<'Pretty' | 'Raw'>('Pretty');
    const [activeTab, setActiveTab] = useState<'Overview' | 'Timeline' | 'Raw'>('Overview');

    const [sidebarWidth, setSidebarWidth] = useState(800);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartWidth = useRef(0);
    const sidebarRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;

            const deltaX = dragStartX.current - e.clientX;
            let newWidth = dragStartWidth.current + deltaX;

            if (newWidth < 400) newWidth = 400;
            if (newWidth > window.innerWidth * 0.9) newWidth = window.innerWidth * 0.9;

            if (sidebarRef.current) {
                sidebarRef.current.style.width = `${newWidth}px`;
            }
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                if (sidebarRef.current) {
                    setSidebarWidth(parseFloat(sidebarRef.current.style.width));
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartWidth.current = sidebarRef.current ? sidebarRef.current.getBoundingClientRect().width : sidebarWidth;

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        e.preventDefault();
        e.stopPropagation();
    };

    // Stats calculation
    const stats = {
        total: traces.length,
        errors: traces.filter(t => t.state === 'Error').length,
        avgLatency: (traces.reduce((acc, t) => acc + parseFloat(t.details.latency), 0) / traces.length).toFixed(2),
        totalTokens: traces.reduce((acc, t) => acc + t.details.tokens.total, 0),
        p95Latency: "1.24s" // Mocked for UI
    };

    const errorRate = ((stats.errors / stats.total) * 100).toFixed(1);
    const { toast } = useToast();

    // Header Actions State
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState('Custom');

    // Filter State with Debouncing
    const [statusFilter, setStatusFilter] = useState<'All' | 'OK' | 'Error'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Columns State
    const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        model: true,
        tokens: true,
        latency: true,
        metric: true,
        timestamp: true,
        state: true
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Apply filters with useMemo to prevent unnecessary recalcs
    const filteredTraces = useMemo(() => {
        return traces.filter(t => {
            const matchesStatus = statusFilter === 'All' || t.state === statusFilter;
            const searchLower = debouncedSearchQuery.toLowerCase();
            const matchesSearch = debouncedSearchQuery === '' ||
                t.name.toLowerCase().includes(searchLower) ||
                t.id.toLowerCase().includes(searchLower) ||
                t.details.user_id.toLowerCase().includes(searchLower);

            let matchesTime = true;
            if (selectedTimeRange !== 'Custom') {
                const now = new Date().getTime();
                const traceTime = t.timestamp; // custom prop we added
                if (selectedTimeRange === 'Last 1 hour') {
                    matchesTime = (now - traceTime) <= 60 * 60 * 1000;
                } else if (selectedTimeRange === 'Last 24 hours') {
                    matchesTime = (now - traceTime) <= 24 * 60 * 60 * 1000;
                } else if (selectedTimeRange === 'Last 7 days') {
                    matchesTime = (now - traceTime) <= 7 * 24 * 60 * 60 * 1000;
                } else if (selectedTimeRange === 'Last 30 days') {
                    matchesTime = (now - traceTime) <= 30 * 24 * 60 * 60 * 1000;
                }
            }

            return matchesStatus && matchesSearch && matchesTime;
        })
            .sort((a, b) => b.timestamp - a.timestamp);
    }, [traces, statusFilter, debouncedSearchQuery, selectedTimeRange]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!traces.length || (e.target as HTMLElement).tagName === 'INPUT') return;

            const currentIndex = selectedTrace ? filteredTraces.findIndex(t => t.id === selectedTrace.id) : -1;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextTrace = filteredTraces[Math.min(currentIndex + 1, filteredTraces.length - 1)];
                setSelectedTrace(nextTrace);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevTrace = filteredTraces[Math.max(currentIndex - 1, 0)];
                setSelectedTrace(prevTrace);
            } else if (e.key === 'Escape') {
                setSelectedTrace(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedTrace, traces, filteredTraces]);

    const totalPages = Math.max(1, Math.ceil(filteredTraces.length / itemsPerPage));
    const paginatedTraces = filteredTraces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page to 1 if filter changes
    useEffect(() => { setCurrentPage(1) }, [statusFilter, debouncedSearchQuery, selectedTimeRange]);

    const formatLocalTime = (ts: number) => {
        const date = new Date(ts);
        return {
            time: date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
            full: date.toLocaleString([], { timeZoneName: 'short' })
        };
    };

    const [hasNewTraces, setHasNewTraces] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setHasNewTraces(true);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getDisplayDates = () => {
        const now = new Date();
        let start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (selectedTimeRange === 'Last 1 hour') start = new Date(now.getTime() - 60 * 60 * 1000);
        else if (selectedTimeRange === 'Last 24 hours') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        else if (selectedTimeRange === 'Last 7 days') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (selectedTimeRange === 'Last 30 days') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const fmt = (d: Date) => d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
        return { start: fmt(start), end: fmt(now) };
    };

    const { start: displayStart, end: displayEnd } = getDisplayDates();

    // Handlers
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setTraces([...generateInitialTraces()]); // shuffle data
            setIsRefreshing(false);
            toast({
                title: "Refreshed",
                description: "Latest traces have been loaded successfully.",
            });
        }, 800);
    };

    const handleExport = () => {
        const headers = ['Trace ID', 'Name', 'Model', 'Tokens', 'Latency', 'Eval Score', 'Timestamp', 'State'].join(',');
        const rows = traces.map(t =>
            `"${t.id}","${t.name}","${t.model}","${t.details.tokens.total}","${t.details.latency}","${t.metric}","${new Date(t.timestamp).toISOString()}","${t.state}"`
        ).join('\n');

        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `traces_export_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            title: "Export Successful",
            description: "Your traces data has been downloaded as a CSV file.",
        });
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Trace log copied to clipboard.",
        });
    };

    const toggleColumn = (key: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-8rem)] w-full overflow-hidden bg-background">
            {/* Custom Minimalist Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-thin::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: hsl(var(--border) / 0.4);
                    border-radius: 10px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--border) / 0.8);
                }
            `}} />

            <div className="relative flex h-full w-full overflow-hidden">
                <main style={{ marginRight: selectedTrace ? `${sidebarWidth}px` : '0px' }}
                    className={cn(
                        "space-y-6 flex-1 overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent pr-4"
                    )}>
                    <div className="w-full space-y-8 pb-12 px-2">
                        {/* Header section with Summary Stats */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-bold tracking-tight">Traces</h1>
                                    <p className="text-muted-foreground">Monitor and debug individual LLM requests and interactions.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-10 px-4 shadow-sm hover:bg-muted/50 transition-all active:scale-95" onClick={handleRefresh} disabled={isRefreshing}>
                                        <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} /> Refresh
                                    </Button>
                                    <Button variant="outline" className="h-10 px-4 shadow-sm hover:bg-muted/50 transition-all active:scale-95" onClick={handleExport}>
                                        <Download className="w-4 h-4 mr-2" /> Export
                                    </Button>
                                </div>
                            </div>

                            {/* Summary Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard
                                    title="Total Traces"
                                    value={stats.total.toLocaleString()}
                                    subtext="Across all services"
                                    icon={Layers}
                                    trend="up"
                                    trendValue="+12%"
                                    colorClass="text-blue-600"
                                    gradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20"
                                />
                                <MetricCard
                                    title="Error Rate"
                                    value={`${errorRate}%`}
                                    subtext={`${stats.errors} failed traces`}
                                    icon={AlertTriangle}
                                    trend="down"
                                    trendValue="-2.4%"
                                    colorClass="text-red-600"
                                    gradient="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20"
                                />
                                <MetricCard
                                    title="P95 Latency"
                                    value={`${stats.p95Latency}`}
                                    subtext={`Avg: ${stats.avgLatency}s`}
                                    icon={Zap}
                                    trend="up"
                                    trendValue="+50ms"
                                    colorClass="text-amber-600"
                                    gradient="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
                                />
                                <MetricCard
                                    title="Total Usage"
                                    value={`${(stats.totalTokens / 1000).toFixed(1)}k`}
                                    subtext="Estimated tokens"
                                    icon={Coins}
                                    colorClass="text-indigo-600"
                                    gradient="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/20"
                                />
                            </div>

                            {/* Actions Bar */}
                            <div className="flex flex-col xl:flex-row gap-4 pt-2">
                                <div className="flex flex-1 gap-3">
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="search"
                                            placeholder="Search by Trace ID, Name, or User..."
                                            className="pl-9 h-11 bg-card border-border/50 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative z-20">
                                        <Button
                                            variant={statusFilter !== 'All' ? 'default' : 'outline'}
                                            className="h-11 px-4 rounded-xl shadow-sm relative group transition-all"
                                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        >
                                            <Filter className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Status: {statusFilter}
                                            {statusFilter !== 'All' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse"></span>}
                                        </Button>
                                        {showFilterDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setShowFilterDropdown(false)}></div>
                                                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-xl shadow-xl z-40 p-2 animate-in fade-in slide-in-from-top-2">
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter by Status</div>
                                                    {['All', 'OK', 'Error'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-lg flex items-center justify-between transition-colors",
                                                                statusFilter === opt && "bg-primary/5 text-primary font-medium"
                                                            )}
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
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative flex items-center rounded-xl border border-border/50 bg-card shadow-sm h-11 px-1 overflow-hidden group">
                                        <Calendar className="w-4 h-4 ml-3 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "h-9 px-3 whitespace-nowrap text-foreground font-medium flex hover:bg-muted/50 focus-visible:ring-0 justify-between gap-2 rounded-lg",
                                                showTimeRangeDropdown && "bg-muted"
                                            )}
                                            onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                                        >
                                            {selectedTimeRange}
                                            <ChevronDown className="w-4 h-4 opacity-50 transition-transform duration-200" style={{ transform: showTimeRangeDropdown ? 'rotate(180deg)' : 'none' }} />
                                        </Button>

                                        <div className="hidden 2xl:flex items-center gap-3 px-3 h-full border-l border-border/50 text-xs text-muted-foreground ml-1">
                                            <span className="whitespace-nowrap">Start: {displayStart}</span>
                                            <span className="h-4 w-px bg-border/50"></span>
                                            <span className="whitespace-nowrap">End: {displayEnd}</span>
                                        </div>

                                        {showTimeRangeDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setShowTimeRangeDropdown(false)}></div>
                                                <div className="absolute top-12 left-0 w-full sm:w-56 bg-card border rounded-xl shadow-xl z-40 p-2 animate-in fade-in slide-in-from-top-2">
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Range</div>
                                                    {['Last 1 hour', 'Last 24 hours', 'Last 7 days', 'Last 30 days', 'Custom'].map(opt => (
                                                        <button
                                                            key={opt}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-lg flex items-center justify-between transition-colors",
                                                                selectedTimeRange === opt && "bg-primary/5 text-primary font-medium"
                                                            )}
                                                            onClick={() => {
                                                                setSelectedTimeRange(opt);
                                                                setShowTimeRangeDropdown(false);
                                                            }}
                                                        >
                                                            {opt}
                                                            {selectedTimeRange === opt && <Check className="w-4 h-4 text-primary" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <Button variant="outline" className="h-11 px-4 rounded-xl shadow-sm hover:bg-muted/50" onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}>
                                            <ColumnsIcon className="w-4 h-4 mr-2" /> Columns
                                        </Button>
                                        {showColumnsDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setShowColumnsDropdown(false)}></div>
                                                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-xl z-40 p-2 animate-in fade-in slide-in-from-top-2">
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Toggle Visibility</div>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {Object.entries({
                                                            id: 'Trace ID', name: 'Name', model: 'Model',
                                                            tokens: 'Tokens', latency: 'Latency', metric: 'Eval Score', timestamp: 'Timestamp', state: 'State'
                                                        }).map(([key, label]) => (
                                                            <button
                                                                key={key}
                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-lg flex items-center gap-3 transition-colors"
                                                                onClick={() => toggleColumn(key as any)}
                                                            >
                                                                <div className={cn(
                                                                    "w-4 h-4 border rounded flex items-center justify-center transition-all",
                                                                    visibleColumns[key as keyof typeof visibleColumns] ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20" : "border-input"
                                                                )}>
                                                                    {visibleColumns[key as keyof typeof visibleColumns] && <Check className="w-3 h-3" />}
                                                                </div>
                                                                <span className={cn(visibleColumns[key as keyof typeof visibleColumns] ? "text-foreground font-medium" : "text-muted-foreground")}>{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="space-y-4">
                            <div className="border rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm border-border/50">
                                {hasNewTraces && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <Button
                                            size="sm"
                                            className="bg-primary text-primary-foreground shadow-lg rounded-full px-4 py-1.5 h-auto text-xs font-bold gap-2 hover:scale-105 transition-transform"
                                            onClick={() => {
                                                handleRefresh();
                                                setHasNewTraces(false);
                                            }}
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            New traces available. Click to refresh
                                        </Button>
                                    </div>
                                )}
                                {isRefreshing && (
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                )}
                                <table className="w-full text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr className="border-b border-border/40">
                                            <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Status</th>
                                            <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Trace ID</th>
                                            {visibleColumns.name && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Name</th>}
                                            {visibleColumns.model && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Model</th>}
                                            {visibleColumns.tokens && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Tokens</th>}
                                            {visibleColumns.latency && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-center">Latency</th>}
                                            {visibleColumns.metric && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-center">Eval Score</th>}
                                            {visibleColumns.timestamp && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Timestamp</th>}
                                            {visibleColumns.state && <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-right">State</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {paginatedTraces.length > 0 ? (
                                            paginatedTraces.map((trace, i) => (
                                                <tr
                                                    key={i}
                                                    onClick={() => setSelectedTrace(trace)}
                                                    className={cn(
                                                        "hover:bg-muted/40 transition-all cursor-pointer group/row active:scale-[0.995]",
                                                        selectedTrace?.id === trace.id ? "bg-primary/5 focus:bg-primary/5" : ""
                                                    )}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className={cn(
                                                            "w-2.5 h-2.5 rounded-full",
                                                            trace.state === 'Error' ? "bg-red-500 animate-pulse" : "bg-green-500"
                                                        )} />
                                                    </td>
                                                    {visibleColumns.id && (
                                                        <td className="px-6 py-4 font-mono text-[11px] font-bold text-muted-foreground group-hover/row:text-primary transition-colors max-w-[120px] truncate" title={trace.id}>
                                                            {trace.id}
                                                        </td>
                                                    )}
                                                    {visibleColumns.name && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-0.5 transition-transform group-hover/row:translate-x-1 duration-300">
                                                                <span className="font-semibold text-sm text-foreground">{trace.name}</span>
                                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{trace.details.service}</span>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {visibleColumns.model && (
                                                        <td className="px-6 py-4">
                                                            <Badge variant="outline" className="font-mono text-[10px] bg-muted/30">
                                                                {trace.model}
                                                            </Badge>
                                                        </td>
                                                    )}
                                                    {visibleColumns.tokens && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 transition-transform group-hover/row:scale-105">
                                                                <Coins className="w-3 h-3 text-indigo-500/70" />
                                                                <span className="font-bold text-[11px] tracking-tight">{trace.details.tokens.total}</span>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {visibleColumns.latency && (
                                                        <td className="px-6 py-4 text-[11px] font-mono">
                                                            <div className="flex items-center justify-center gap-1.5 transition-transform group-hover/row:scale-105">
                                                                <Thermometer className={cn("w-3 h-3", parseFloat(trace.details.latency) > 3.0 ? "text-red-500" : parseFloat(trace.details.latency) > 1.5 ? "text-amber-500" : "text-blue-500")} />
                                                                <span className={cn("font-bold tracking-tight", parseFloat(trace.details.latency) > 3.0 ? "text-red-600" : parseFloat(trace.details.latency) > 1.5 ? "text-amber-600" : "text-blue-600")}>{trace.details.latency}</span>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {visibleColumns.metric && (
                                                        <td className="px-6 py-4 text-center">
                                                            <Badge className={cn(
                                                                "font-bold text-[11px]",
                                                                trace.metric > 90 ? "bg-green-500/10 text-green-600 border-green-200" :
                                                                    trace.metric > 75 ? "bg-blue-500/10 text-blue-600 border-blue-200" :
                                                                        "bg-amber-500/10 text-amber-600 border-amber-200"
                                                            )}>
                                                                {trace.metric}%
                                                            </Badge>
                                                        </td>
                                                    )}
                                                    {visibleColumns.timestamp && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-0.5 group/time relative" title={formatLocalTime(trace.timestamp).full}>
                                                                <span className="text-[11px] font-bold text-foreground whitespace-nowrap tracking-tight">{formatLocalTime(trace.timestamp).time}</span>
                                                                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap tracking-wider">{formatLocalTime(trace.timestamp).date}</span>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {visibleColumns.state && (
                                                        <td className="px-6 py-4 text-right">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-widest",
                                                                    trace.state === 'Error'
                                                                        ? "bg-red-500/10 text-red-600 border-red-200"
                                                                        : "bg-green-500/10 text-green-600 border-green-200"
                                                                )}
                                                            >
                                                                {trace.state}
                                                            </Badge>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="px-6 py-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Search className="w-8 h-8 text-muted-foreground/50 mb-2" />
                                                        <p>No traces found for the active filters.</p>
                                                        {(statusFilter !== 'All' || searchQuery !== '') && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setStatusFilter('All');
                                                                    setSearchQuery('');
                                                                }}
                                                                className="h-auto p-0"
                                                            >
                                                                Clear all filters
                                                            </Button>
                                                        )}
                                                    </div>
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
                        </div>
                    </div>
                </main>

                {/* Slide-out Sidebar - Minimalist Langfuse Style */}
                <aside
                    ref={sidebarRef}
                    style={{ width: `${sidebarWidth}px`, maxWidth: '90vw' }}
                    className={cn(
                        "fixed top-[8rem] right-0 bottom-0 bg-card/98 backdrop-blur-xl border-l border-border/40 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col",
                        selectedTrace ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                    )}
                >
                    {/* Resize Handle */}
                    {selectedTrace && (
                        <div
                            onMouseDown={handleMouseDown}
                            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/10 transition-colors z-[60] flex items-center justify-center -translate-x-1/2 group"
                        >
                            <div className="h-12 w-1 bg-border/40 rounded-full group-hover:bg-primary transition-colors" />
                        </div>
                    )}

                    {selectedTrace && (
                        <>
                            {/* Sidebar Header */}
                            <div className="p-6 border-b border-border/40 flex flex-col gap-4 bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-widest",
                                                    selectedTrace.state === 'Error'
                                                        ? "bg-red-500/10 text-red-600 border-red-200"
                                                        : "bg-green-500/10 text-green-600 border-green-200"
                                                )}
                                            >
                                                {selectedTrace.state}
                                            </Badge>
                                            <h2 className="text-2xl font-bold tracking-tight">{selectedTrace.name}</h2>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-muted/50 w-fit px-2 py-1 rounded-md">
                                            <Hash className="w-3 h-3" /> {selectedTrace.id}
                                            <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-transparent" onClick={() => handleCopy(selectedTrace.id)}>
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-bold text-xs rounded-lg"
                                            onClick={() => {
                                                const input = selectedTrace.details.input as any;
                                                const query = input.query || input.text || JSON.stringify(input);

                                                toast({
                                                    title: "Opening in Playground",
                                                    description: "Transferring trace context to simulation...",
                                                });

                                                navigate('/evaluations/prompt-playground', {
                                                    state: { query }
                                                });
                                            }}
                                        >
                                            <Zap className="w-3.5 h-3.5 mr-1.5" /> Open in Playground
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all active:scale-95" onClick={() => setSelectedTrace(null)}>
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mt-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Latency</span>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary/70" />
                                            <span className="text-sm font-bold">{selectedTrace.details.latency}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Cost</span>
                                        <div className="flex items-center gap-2">
                                            <CircleDollarSign className="w-4 h-4 text-green-600/70" />
                                            <span className="text-sm font-bold">{selectedTrace.details.cost}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Tokens</span>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-500/70" />
                                            <span className="text-sm font-bold">{selectedTrace.details.tokens.total}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Service</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                                                <Activity className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm font-bold truncate">{selectedTrace.details.service}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="px-6 border-b border-border/50 bg-card">
                                <div className="flex items-center gap-8">
                                    {(['Overview', 'Timeline', 'Raw'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                "py-4 text-sm font-semibold transition-all relative",
                                                activeTab === tab
                                                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-t-full"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                {tab === 'Overview' && <Search className="w-4 h-4" />}
                                                {tab === 'Timeline' && <Activity className="w-4 h-4" />}
                                                {tab === 'Raw' && <Fingerprint className="w-4 h-4" />}
                                                {tab}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Body */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-muted/5">

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

                                        {/* Payload Inspector with Pretty/Raw Toggle */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Payload Inspector</h3>
                                                <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
                                                    {(['Pretty', 'Raw'] as const).map(mode => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => setPayloadViewMode(mode)}
                                                            className={cn(
                                                                "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                                                payloadViewMode === mode ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                            )}
                                                        >
                                                            {mode}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                {/* Input Section */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            Input
                                                        </span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted" onClick={() => handleCopy(JSON.stringify(selectedTrace.details.input, null, 2))}>
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                    <PayloadContent content={selectedTrace.details.input} mode={payloadViewMode} />
                                                </div>

                                                {/* Output Section */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            Output
                                                        </span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted" onClick={() => handleCopy(JSON.stringify(selectedTrace.details.output, null, 2))}>
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                    <PayloadContent content={selectedTrace.details.output} mode={payloadViewMode} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TIMELINE TAB - Waterfall Visualization */}
                                {activeTab === 'Timeline' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                Waterfall Timeline
                                                <Badge variant="secondary" className="font-normal text-[10px]">{selectedTrace.details.observations.length} spans</Badge>
                                            </h3>
                                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div> Generation
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Span
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative border border-border/50 rounded-xl bg-card overflow-hidden">
                                            {/* Scale Header */}
                                            <div className="flex border-b border-border/30 bg-muted/20 text-[10px] font-mono text-muted-foreground">
                                                <div className="w-1/3 p-2 border-r border-border/30 font-bold uppercase tracking-wider">Operation</div>
                                                <div className="flex-1 relative p-2 h-8">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-px bg-border/50"></div>
                                                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 text-[9px]">0.5s</div>
                                                    <div className="absolute left-2/4 top-1/2 -translate-y-1/2 text-[9px]">1.0s</div>
                                                    <div className="absolute left-3/4 top-1/2 -translate-y-1/2 text-[9px]">1.5s</div>
                                                </div>
                                            </div>

                                            <div className="divide-y divide-border/30">
                                                {selectedTrace.details.observations.map((obs, idx) => {
                                                    const durVal = parseFloat(obs.duration);
                                                    const maxDur = 3.0;
                                                    const width = (durVal / maxDur) * 100;
                                                    const startOffset = (idx * 8);

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "flex group/span hover:bg-muted/30 transition-colors cursor-pointer",
                                                                selectedSpan?.id === obs.id && "bg-primary/5 border-l-2 border-primary"
                                                            )}
                                                            onClick={() => {
                                                                setSelectedSpan(obs);
                                                                setActiveTab('Overview');
                                                                toast({
                                                                    title: `${obs.name} Selected`,
                                                                    description: "Payload inspector updated below.",
                                                                });
                                                            }}
                                                        >
                                                            <div className="w-1/3 p-3 border-r border-border/30 relative flex flex-col gap-1">
                                                                {/* ... (rest of the content remains similar) */}
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <div className={cn(
                                                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                                                        obs.type === 'Generation' ? "bg-primary" : "bg-blue-500"
                                                                    )}></div>
                                                                    <span className="font-bold text-xs truncate" title={obs.name}>{obs.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                                                    <span className="uppercase tracking-tighter opacity-70">{obs.type}</span>
                                                                    <span className="opacity-40">•</span>
                                                                    <span className={cn(obs.status === 'Failed' && "text-red-500 font-bold")}>{obs.status}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 relative p-3 bg-muted/5 h-14 overflow-hidden">
                                                                {obs.status === 'Failed' && (
                                                                    <div className="absolute inset-0 bg-red-500/5 flex items-center justify-center pointer-events-none z-10">
                                                                        <div className="h-[2px] w-full bg-red-500/20" />
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 flex pointer-events-none opacity-20">
                                                                    <div className="flex-1 border-r border-border/50"></div>
                                                                    <div className="flex-1 border-r border-border/50"></div>
                                                                    <div className="flex-1 border-r border-border/50"></div>
                                                                    <div className="flex-1"></div>
                                                                </div>
                                                                <div
                                                                    className={cn(
                                                                        "absolute top-1/2 -translate-y-1/2 h-5 rounded-md flex items-center px-2 text-[9px] font-bold text-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm",
                                                                        obs.type === 'Generation'
                                                                            ? "bg-gradient-to-r from-primary/90 to-primary"
                                                                            : "bg-gradient-to-r from-blue-400 to-blue-600"
                                                                    )}
                                                                    style={{
                                                                        left: `${startOffset}%`,
                                                                        width: `${width}%`,
                                                                    }}
                                                                >
                                                                    {width > 12 && <span className="truncate leading-none">{obs.duration}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    {selectedSpan ? `Selected Span: ${selectedSpan.name}` : 'Trace Payload Overview'}
                                                    {selectedSpan && <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setSelectedSpan(null)}>Reset to Trace</Button>}
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-3">
                                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Input</span>
                                                    <PayloadContent content={selectedSpan ? selectedSpan.input : selectedTrace.details.input} mode={payloadViewMode} />
                                                </div>
                                                <div className="space-y-3">
                                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Output</span>
                                                    <PayloadContent content={selectedSpan ? selectedSpan.output : selectedTrace.details.output} mode={payloadViewMode} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* RAW TAB */}
                                {activeTab === 'Raw' && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold">Raw Trace Log</h3>
                                            <Button variant="outline" size="sm" className="h-7 text-xs bg-muted/50 hover:bg-muted" onClick={() => handleCopy(JSON.stringify(selectedTrace.details, null, 2))}>
                                                <Copy className="w-3 h-3 mr-1.5" /> Copy All
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
                </aside>
            </div>
        </div>
    );
};

export default TracesPage;
