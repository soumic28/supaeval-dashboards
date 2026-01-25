import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Play, Filter, CheckCircle, CircleX, Clock } from 'lucide-react';

export default function EvaluationsPage() {
    const runs = [
        { id: "RUN-2024-001", config: "GPT-4 Customer Support", dataset: "Support V1", status: "Success", score: "92.5%", date: "Just now", duration: "4m 12s" },
        { id: "RUN-2024-002", config: "Claude 3 Opus RAG", dataset: "RAG Golden Set", status: "Running", score: "-", date: "5 mins ago", duration: "Running" },
        { id: "RUN-2024-003", config: "Llama 3 70B Local", dataset: "General QA", status: "Failed", score: "0%", date: "1 hour ago", duration: "45s" },
        { id: "RUN-2024-004", config: "GPT-3.5 Turbo Baseline", dataset: "Support V1", status: "Success", score: "78.2%", date: "2 hours ago", duration: "2m 30s" },
        { id: "RUN-2024-005", config: "Mistral Large", dataset: "Reasoning Bench", status: "Success", score: "85.1%", date: "1 day ago", duration: "12m 10s" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
                    <p className="text-muted-foreground">Monitor and analyze your agent evaluation runs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button>
                        <Play className="mr-2 h-4 w-4" />
                        New Run
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Runs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <div className="grid grid-cols-7 text-sm font-medium text-muted-foreground px-4 py-2 border-b border-border/50">
                            <div className="col-span-2">Run ID / Config</div>
                            <div className="col-span-1">Dataset</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-1 text-right">Score</div>
                            <div className="col-span-1 text-right">Duration</div>
                            <div className="col-span-1 text-right">Date</div>
                        </div>
                        {runs.map((run) => (
                            <div key={run.id} className="grid grid-cols-7 items-center px-4 py-4 hover:bg-muted/50 transition-colors rounded-md border-b border-border/50 last:border-0">
                                <div className="col-span-2">
                                    <div className="font-medium">{run.id}</div>
                                    <div className="text-xs text-muted-foreground">{run.config}</div>
                                </div>
                                <div className="col-span-1 text-sm">{run.dataset}</div>
                                <div className="col-span-1">
                                    <Badge variant={
                                        run.status === 'Success' ? 'success' :
                                            run.status === 'Failed' ? 'destructive' :
                                                run.status === 'Running' ? 'secondary' : 'outline'
                                    }>
                                        {run.status === 'Success' && <CheckCircle className="mr-1 h-3 w-3" />}
                                        {run.status === 'Failed' && <CircleX className="mr-1 h-3 w-3" />}
                                        {run.status === 'Running' && <Clock className="mr-1 h-3 w-3 animate-spin" />}
                                        {run.status}
                                    </Badge>
                                </div>
                                <div className="col-span-1 text-right font-medium">{run.score}</div>
                                <div className="col-span-1 text-right text-sm text-muted-foreground">{run.duration}</div>
                                <div className="col-span-1 text-right text-sm text-muted-foreground">{run.date}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
