
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { agentService } from '@/services/agents';
import type { Agent } from '@/types/AgentTypes';
import { Loader2, AlertCircle } from 'lucide-react';

export function AgentsActionableInsights() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b border-border">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Agent Name</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Actionable Insights</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Improvement Dataset</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Runs</th>
                                <th className="h-10 px-6 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">SEQ Score</th>
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
