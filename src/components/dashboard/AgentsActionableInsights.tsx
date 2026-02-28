
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { agentService } from '@/services/agents';
import type { Agent } from '@/types/AgentTypes';
import { Loader2, AlertCircle, MoreVertical, Edit2, Plus, Layers as LayersIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

export function AgentsActionableInsights() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLTableCellElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const data = await agentService.getAll();
                setAgents(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch agents for insights:", err);
                setError("Failed to load agent metrics.");
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    // Deterministic mock data for missing metrics based on index
    const getMockMetrics = (index: number) => {
        const metricsList = [
            { insight: "Need to improve at retrieval layer by 5%", dataset: "Retrieval-Core-V1", runs: 12, seq: 85 },
            { insight: "Need to improve at Intent detection layer by 50%", dataset: "Intent-Master-V2", runs: 45, seq: 45 },
            { insight: "Is failing at security dataset by 50%", dataset: "Security-Hardcase-V8", runs: 22, seq: 35 },
            { insight: "Agent is running correctly", dataset: "Production-V1", runs: 128, seq: 98 },
            { insight: "Latency spikes detected in embeddings", dataset: "Speed-Test-V3", runs: 56, seq: 72 },
            { insight: "High hallucination rate observed", dataset: "Fact-Check-V1", runs: 34, seq: 60 }
        ];
        return metricsList[index % metricsList.length];
    };

    const getSeverityColor = (text: string, seq: number) => {
        if (text.includes("50%") || seq < 50) return "text-red-600 font-medium";
        if (text.includes("5%") || seq < 90) return "text-amber-600 font-medium";
        return "text-green-600 font-medium";
    };

    if (loading) {
        return (
            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">Agents Health & Status</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">Agents Health & Status</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center flex-col text-muted-foreground">
                    <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                    <p>{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (agents.length === 0) {
        return (
            <Card className="border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">Agents Health & Status</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center flex-col text-muted-foreground">
                    <p>No agents available yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">Agents Health & Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-visible">
                    <table className="w-full caption-bottom text-sm select-none">
                        <thead className="[&_tr]:border-b border-border">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Agent Name</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Actionable Insights</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Improvement Dataset</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Runs</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">SEQ Score</th>
                                <th className="h-10 px-6 text-right align-middle font-medium text-muted-foreground whitespace-nowrap w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 text-zinc-600">
                            {agents.map((agent, index) => {
                                const metrics = getMockMetrics(index);
                                return (
                                    <tr
                                        key={agent.id}
                                        className="border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                                        onClick={() => navigate('/agents/connected')}
                                    >
                                        <td className="p-6 align-middle font-medium text-foreground">{agent.name}</td>
                                        <td className={`p-6 align-middle ${getSeverityColor(metrics.insight, metrics.seq)}`}>
                                            {metrics.insight}
                                        </td>
                                        <td className="p-6 align-middle text-muted-foreground">{metrics.dataset}</td>
                                        <td className="p-6 align-middle">{metrics.runs}</td>
                                        <td className="p-6 align-middle">
                                            <Badge
                                                variant={metrics.seq < 50 ? "destructive" : metrics.seq < 80 ? "secondary" : "success"}
                                                className={metrics.seq < 50 ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200" : metrics.seq < 80 ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" : "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"}
                                            >
                                                {metrics.seq}%
                                            </Badge>
                                        </td>
                                        <td
                                            className="p-6 align-middle text-right relative"
                                            ref={openMenuId === agent.id ? menuRef : null}
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === agent.id ? null : agent.id);
                                                }}
                                                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                            >
                                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                            </motion.button>

                                            <AnimatePresence>
                                                {openMenuId === agent.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute right-6 top-12 z-50 min-w-[200px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none text-left"
                                                    >
                                                        <div className="flex flex-col">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/configurations/agents?edit=${agent.id}`);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <Edit2 className="mr-2 h-4 w-4" />
                                                                <span>Edit Configuration</span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/configurations/metrics?agentId=${agent.id}`);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <LayersIcon className="mr-2 h-4 w-4" />
                                                                <span>Configure Layers</span>
                                                            </button>
                                                            <div className="h-px bg-border my-1 mx-1" />
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate('/configurations/agents?create=true');
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                <span>Create New Agent</span>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
