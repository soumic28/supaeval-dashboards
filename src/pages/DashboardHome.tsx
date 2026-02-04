import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CommandPalette } from '@/components/CommandPalette';
import { OnboardingChecklist } from '@/components/OnboardingChecklist';
import { Activity, Database, Settings, Play, BarChart2, MessageSquare, Code2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useState, useEffect } from 'react';
import { runService } from '@/services/runs';
import type { Run } from '@/types/models';

export default function DashboardHome() {
    const navigate = useNavigate();
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [recentRuns, setRecentRuns] = useState<Run[]>([]);
    const [loadingRuns, setLoadingRuns] = useState(true);

    useKeyboardShortcut([
        {
            key: 'k',
            description: 'Global search',
            callback: () => {
                console.log('K pressed - opening command palette');
                setShowCommandPalette(true);
            }
        },
    ]);

    useEffect(() => {
        const fetchRuns = async () => {
            try {
                const response = await runService.getAll({ page_size: 5 });
                setRecentRuns(response.items || []);
            } catch (error) {
                console.error("Failed to fetch runs", error);
            } finally {
                setLoadingRuns(false);
            }
        };
        fetchRuns();
    }, []);



    const navTiles = [
        { name: 'Datasets', description: 'Manage evaluation datasets & benchmarks', icon: Database, path: '/datasets', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Configurations', description: 'Evaluation settings & metric definitions', icon: Settings, path: '/configs', color: 'text-slate-500', bg: 'bg-slate-500/10' },
        { name: 'Evaluations', description: 'Run and monitor agent evaluations', icon: Play, path: '/evaluations', color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Dashboards', description: 'Deep dive analytics & failure analysis', icon: BarChart2, path: '/dashboards', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'RLHF', description: 'Review feedback & improve models', icon: MessageSquare, path: '/rlhf', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { name: 'SDK & API', description: 'Integration docs & API keys', icon: Code2, path: '/sdk', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString();
    };

    const agentHealthData = [
        { name: "Agent X", insight: "Need to improve at retrieval layer by 5%", dataset: "Retrieval-Core-V1", runs: 12, seq: 85 },
        { name: "Agent Y", insight: "Need to improve at Intent detection layer by 50%", dataset: "Intent-Master-V2", runs: 45, seq: 45 },
        { name: "Agent X", insight: "Is failing at security dataset by 50%", dataset: "Security-Hardcase-V8", runs: 22, seq: 35 },
        { name: "Agent Z", insight: "Agent is running correctly", dataset: "Production-V1", runs: 128, seq: 98 },
    ];

    const getSeverityColor = (text: string, seq: number) => {
        if (text.includes("50%") || seq < 50) return "text-red-500 font-medium";
        if (text.includes("5%") || seq < 90) return "text-amber-500 font-medium";
        return "text-green-500 font-medium";
    };

    return (
        <>
            <CommandPalette
                open={showCommandPalette}
                onClose={() => setShowCommandPalette(false)}
            />

            <div className="space-y-8">
                <div data-tour="dashboard">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Actionable insights and performance metrics for your agents.</p>
                </div>

                <OnboardingChecklist />

                <Card>
                    <CardHeader>
                        <CardTitle>Agents Health & Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Agent Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actionable Insights</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Improvement Dataset</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Number of runs</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SEQ score</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {agentHealthData.map((agent, index) => (
                                        <tr
                                            key={index}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                                            onClick={() => navigate('/agents/connected')}
                                        >
                                            <td className="p-4 align-middle font-medium">{agent.name}</td>
                                            <td className={`p-4 align-middle ${getSeverityColor(agent.insight, agent.seq)}`}>{agent.insight}</td>
                                            <td className="p-4 align-middle text-muted-foreground">{agent.dataset}</td>
                                            <td className="p-4 align-middle">{agent.runs}</td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={agent.seq < 50 ? "destructive" : agent.seq < 80 ? "secondary" : "success"}>
                                                    {agent.seq}%
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {navTiles.map((tile, index) => (
                            <motion.div
                                key={tile.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(tile.path)}
                                className="cursor-pointer"
                            >
                                <Card className="h-full hover:border-primary/50 transition-colors">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${tile.bg} ${tile.color}`}>
                                            <tile.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                                {tile.name}
                                                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">{tile.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Evaluations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loadingRuns ? (
                                    <div className="text-center py-4 text-muted-foreground">Loading recent runs...</div>
                                ) : recentRuns.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">No runs found.</div>
                                ) : (
                                    recentRuns.map((run) => (
                                        <div key={run.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Activity className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{run.agent_id.substring(0, 8)}...</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{run.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'destructive' : 'secondary'}>
                                                    {run.status}
                                                </Badge>
                                                <div className="text-sm font-medium w-12 text-right">
                                                    {run.metrics ? Object.values(run.metrics)[0] || "-" : "-"}
                                                </div>
                                                <div className="text-xs text-muted-foreground w-20 text-right">{formatDate(run.created_at)}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Coverage Gaps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Retrieval Accuracy</span>
                                        <span className="font-medium">78%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-foreground w-[78%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Hallucination Rate</span>
                                        <span className="font-medium">2.1%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-foreground w-[98%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Tool Usage</span>
                                        <span className="font-medium">95%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-foreground w-[95%]" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
