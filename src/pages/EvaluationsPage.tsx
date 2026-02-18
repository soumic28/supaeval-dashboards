import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Play, Filter, CheckCircle, CircleX, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { runService } from '@/services/runs';
import { useNavigate } from 'react-router-dom';

export default function EvaluationsPage() {
    const navigate = useNavigate();
    const [runs, setRuns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentRuns = async () => {
            try {
                setIsLoading(true);
                // Fetch recent runs (page 1, size 5)
                const response = await runService.getAll({ page: 1, page_size: 5 });

                if (response && response.items && Array.isArray(response.items)) {
                    const mappedRuns = response.items.map((r: any) => ({
                        id: r.id,
                        config: r.eval_profile_id || "Default Config",
                        dataset: r.dataset_id || "Unknown Dataset",
                        status: r.status === 'completed' ? 'Success' : r.status === 'failed' ? 'Failed' : 'Running',
                        score: r.metrics?.unified_score ? `${r.metrics.unified_score}%` : "-",
                        date: r.created_at ? new Date(r.created_at).toLocaleString() : "Recently",
                        duration: "N/A" // Duration not in Run list yet
                    }));
                    setRuns(mappedRuns);
                } else {
                    setRuns([]);
                }
            } catch (error) {
                console.error("Failed to fetch recent runs", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecentRuns();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
                    <p className="text-muted-foreground">Monitor and analyze your agent evaluation runs.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button className="flex-1 md:flex-none">
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
                    {isLoading ? (
                        <div className="flex justify-center p-6 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            Loading recent runs...
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="hidden md:grid grid-cols-7 text-sm font-medium text-muted-foreground px-4 py-2 border-b border-border/50">
                                <div className="col-span-2">Run ID / Config</div>
                                <div className="col-span-1">Dataset</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-1 text-right">Score</div>
                                <div className="col-span-1 text-right">Duration</div>
                                <div className="col-span-1 text-right">Date</div>
                            </div>
                            {runs.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">No recent runs found.</div>
                            ) : (
                                runs.map((run) => (
                                    <div
                                        key={run.id}
                                        className="flex flex-col md:grid md:grid-cols-7 gap-4 md:gap-0 items-start md:items-center px-4 py-4 hover:bg-muted/50 transition-colors rounded-md border-b border-border/50 last:border-0 cursor-pointer"
                                        onClick={() => navigate(`/evaluations/run-details?id=${run.id}`)}
                                    >
                                        <div className="col-span-2 w-full md:w-auto">
                                            <div className="font-medium max-w-[150px] truncate" title={run.id}>{run.id}</div>
                                            <div className="text-xs text-muted-foreground">{run.config}</div>
                                        </div>
                                        <div className="col-span-1 w-full md:w-auto flex justify-between md:block">
                                            <span className="md:hidden text-sm text-muted-foreground">Dataset:</span>
                                            <span className="text-sm max-w-[100px] truncate" title={run.dataset}>{run.dataset}</span>
                                        </div>
                                        <div className="col-span-1 w-full md:w-auto flex justify-between md:block">
                                            <span className="md:hidden text-sm text-muted-foreground">Status:</span>
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
                                        <div className="col-span-1 w-full md:w-auto flex justify-between md:block md:text-right">
                                            <span className="md:hidden text-sm text-muted-foreground">Score:</span>
                                            <span className="font-medium">{run.score}</span>
                                        </div>
                                        <div className="col-span-1 w-full md:w-auto flex justify-between md:block md:text-right">
                                            <span className="md:hidden text-sm text-muted-foreground">Duration:</span>
                                            <span className="text-sm text-muted-foreground">{run.duration}</span>
                                        </div>
                                        <div className="col-span-1 w-full md:w-auto flex justify-between md:block md:text-right">
                                            <span className="md:hidden text-sm text-muted-foreground">Date:</span>
                                            <span className="text-sm text-muted-foreground">{run.date}</span>
                                        </div>
                                    </div>
                                )))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
