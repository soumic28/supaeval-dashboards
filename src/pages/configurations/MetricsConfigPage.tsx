import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart2, Blocks, Database, LayoutGrid, Layers, CircleDot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapMetricsDialog } from '@/components/configurations/MapMetricsDialog';
import type { Agent } from '@/types/AgentTypes';
import { agentService } from '@/services/agents';
import { cn } from '@/lib/utils';

export default function MetricsConfigPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const autoOpenHandled = useRef(false);

    // Sidebar resize logic
    const [sidebarWidth, setSidebarWidth] = useState(600);
    const [isDragging, setIsDragging] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 400 && newWidth < window.innerWidth * 0.9) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        loadAgents();
    }, []);

    // Auto-open dialog when navigated with ?agentId=<id>
    useEffect(() => {
        if (autoOpenHandled.current || loading || agents.length === 0) return;
        const agentId = searchParams.get('agentId');
        if (agentId) {
            const match = agents.find(a => a.id === agentId);
            if (match) {
                setSelectedAgent(match);
                setIsDialogOpen(true);
                autoOpenHandled.current = true;
                // Clean up the URL param
                setSearchParams({}, { replace: true });
            }
        }
    }, [agents, loading, searchParams, setSearchParams]);

    const loadAgents = async () => {
        setLoading(true);
        try {
            const data = await agentService.getAll();
            setAgents(data);
        } catch (err) {
            console.error("Failed to load agents", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditAgentMetrics = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsDialogOpen(true);
    };

    const getIconForCategory = (category: string) => {
        switch (category) {
            case 'Production': return <Database className="h-5 w-5 text-primary" />;
            case 'Staging': return <Layers className="h-5 w-5 text-primary" />;
            default: return <Blocks className="h-5 w-5 text-primary" />;
        }
    };

    return (
        <div className="relative flex w-full overflow-hidden bg-background min-h-[calc(100vh-8rem)]">
            <div
                style={{ marginRight: isDialogOpen ? `${sidebarWidth}px` : '0px' }}
                className="flex-1 transition-[margin] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] p-8 max-w-full"
            >
                <div className="space-y-8 h-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Evaluation Layers Configuration</h1>
                            <p className="text-muted-foreground">Configure evaluation layers for mapping agents.</p>
                        </div>
                    </div>

                    {/* Agents Grid */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {agents.map((agent, index) => (
                                <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    layout
                                >
                                    <Card
                                        className="hover:border-primary/50 transition-all group flex flex-col h-full"
                                    >
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 border rounded-md group-hover:bg-primary/5 transition-colors">
                                                    {getIconForCategory(agent.category)}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                                        {agent.name}
                                                    </CardTitle>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{agent.category}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col justify-end pt-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge variant={agent.metrics?.length ? "default" : "secondary"} className="text-xs whitespace-nowrap">
                                                    <BarChart2 className="w-3 h-3 mr-1 shrink-0" />
                                                    {agent.metrics?.length || 0} Layers Mapped
                                                </Badge>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                                    <CircleDot className={`w-3 h-3 shrink-0 ${agent.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`} />
                                                    {agent.status}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full mt-4"
                                                onClick={() => handleEditAgentMetrics(agent)}
                                            >
                                                Configure Layers
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {!loading && agents.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-center bg-card/50">
                                <LayoutGrid className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">No Agents Found</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                                    You need to create an agent first before you can map evaluation layers to it.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Slide-out Sidebar - Metrics Mapping */}
            <aside
                ref={sidebarRef}
                style={{ width: `${sidebarWidth}px`, maxWidth: '90vw' }}
                className={cn(
                    "fixed top-[4rem] right-0 bottom-0 bg-card/98 backdrop-blur-xl border-l border-border/40 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col",
                    isDialogOpen && selectedAgent ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                )}
            >
                {/* Resize Handle */}
                {isDialogOpen && (
                    <div
                        onMouseDown={handleMouseDown}
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/10 transition-colors z-[60] flex items-center justify-center -translate-x-1/2 group"
                    >
                        <div className="h-12 w-1 bg-border/40 rounded-full group-hover:bg-primary transition-colors" />
                    </div>
                )}

                {isDialogOpen && selectedAgent && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-border/40 flex justify-between items-center bg-muted/20">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Configure Layers</h2>
                                <p className="text-sm text-muted-foreground">Map metrics to {selectedAgent.name}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all active:scale-95" onClick={() => setIsDialogOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-hidden h-full">
                            <MapMetricsDialog
                                open={true}
                                onOpenChange={() => { }}
                                agent={selectedAgent}
                                onSaved={loadAgents}
                                hideDialogWrapper={true}
                            />
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}
