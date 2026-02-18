
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function AgentsActionableInsights() {
    const navigate = useNavigate();

    const agentHealthData = [
        { name: "Agent X", insight: "Need to improve at retrieval layer by 5%", dataset: "Retrieval-Core-V1", runs: 12, seq: 85 },
        { name: "Agent Y", insight: "Need to improve at Intent detection layer by 50%", dataset: "Intent-Master-V2", runs: 45, seq: 45 },
        { name: "Agent X", insight: "Is failing at security dataset by 50%", dataset: "Security-Hardcase-V8", runs: 22, seq: 35 },
        { name: "Agent Z", insight: "Agent is running correctly", dataset: "Production-V1", runs: 128, seq: 98 },
    ];

    const getSeverityColor = (text: string, seq: number) => {
        if (text.includes("50%") || seq < 50) return "text-red-600 font-medium";
        if (text.includes("5%") || seq < 90) return "text-amber-600 font-medium";
        return "text-green-600 font-medium";
    };

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
                            {agentHealthData.map((agent, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer"
                                    onClick={() => navigate('/agents/connected')}
                                >
                                    <td className="p-6 align-middle font-medium text-foreground">{agent.name}</td>
                                    <td className={`p-6 align-middle ${getSeverityColor(agent.insight, agent.seq)}`}>
                                        {agent.insight}
                                    </td>
                                    <td className="p-6 align-middle text-muted-foreground">{agent.dataset}</td>
                                    <td className="p-6 align-middle">{agent.runs}</td>
                                    <td className="p-6 align-middle">
                                        <Badge
                                            variant={agent.seq < 50 ? "destructive" : agent.seq < 80 ? "secondary" : "success"}
                                            className={agent.seq < 50 ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200" : agent.seq < 80 ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" : "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"}
                                        >
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
    );
}
