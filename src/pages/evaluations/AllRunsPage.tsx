
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Filter, Download, GitCompare, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { NewRunModal } from '@/components/evaluations/NewRunModal';
import { useState, useEffect } from 'react';
import { runService } from "@/services/runs";

const AllRunsPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isNewRunModalOpen, setIsNewRunModalOpen] = useState(false);
    const [runs, setRuns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRuns = async () => {
            try {
                setIsLoading(true);
                const response = await runService.getAll({ page: 1, page_size: 50 });

                if (response && response.items && Array.isArray(response.items)) {
                    const mappedRuns = response.items.map((r: any) => ({
                        id: r.id,
                        config: r.eval_profile_id ? `Config (${r.eval_profile_id.slice(0, 8)}...)` : "Default Config",
                        dataset: r.dataset_id ? `Dataset (${r.dataset_id.slice(0, 8)}...)` : "Unknown Dataset",
                        model: r.model_tested || "GPT-4 (Inferred)",
                        faithfulness: r.metrics?.faithfulness || 0,
                        relevance: r.metrics?.relevance || 0,
                        status: r.status || "Unknown",
                        date: r.created_at ? new Date(r.created_at).toLocaleString() : "Recently",
                        unifiedScore: r.metrics?.unified_score || 0,
                        threshold: 70 // default
                    }));
                    setRuns(mappedRuns);
                } else if (response && Array.isArray(response)) {
                    // Handle case where API returns array directly (no pagination wrapper)
                    const mappedRuns = response.map((r: any) => ({
                        id: r.id,
                        config: r.eval_profile_id ? `Config (${r.eval_profile_id.slice(0, 8)}...)` : "Default Config",
                        dataset: r.dataset_id ? `Dataset (${r.dataset_id.slice(0, 8)}...)` : "Unknown Dataset",
                        model: r.model_tested || "GPT-4 (Inferred)",
                        faithfulness: r.metrics?.faithfulness || 0,
                        relevance: r.metrics?.relevance || 0,
                        status: r.status || "Unknown",
                        date: r.created_at ? new Date(r.created_at).toLocaleString() : "Recently",
                        unifiedScore: r.metrics?.unified_score || 0,
                        threshold: 70 // default
                    }));
                    setRuns(mappedRuns);
                } else {
                    setRuns([]);
                }
            } catch (error) {
                console.error("Failed to fetch runs", error);
                toast({
                    title: "Error",
                    description: "Failed to load runs. Please try again.",
                    variant: "destructive"
                });
                setRuns([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRuns();
    }, []);

    const handleFilter = () => {
        toast({
            title: "Filter Runs",
            description: "Advanced filtering options are coming soon.",
        });
    };

    const handleDownload = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        toast({
            title: "Download Report",
            description: `Downloading report for ${id}... (Simulated)`,
        });
    };

    const handleCompare = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        // In a real app, you might select multiple or compare against a baseline.
        // For now, we navigate to the comparisons page, passing this ID.
        navigate(`/benchmarks/comparisons?runId=${id}`);
    };

    return (
        <div className="space-y-6">
            <NewRunModal open={isNewRunModalOpen} onOpenChange={setIsNewRunModalOpen} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Runs</h1>
                    <p className="text-muted-foreground">History of all evaluation runs across your projects.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleFilter}>
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button onClick={() => setIsNewRunModalOpen(true)}>
                        <Play className="w-4 h-4 mr-2" />
                        New Run
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                {isLoading ? (
                    <div className="p-8 flex justify-center items-center text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading runs...
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-3">Run ID</th>
                                <th className="px-6 py-3">Configuration</th>
                                <th className="px-6 py-3">Dataset</th>
                                <th className="px-6 py-3">Model</th>
                                <th className="px-6 py-3">Scores</th>
                                <th className="px-6 py-3">SupaEval- Unified-Quality-Score</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {runs.map((run) => (
                                <tr
                                    key={run.id}
                                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/evaluations/run-details?id=${run.id}`)}
                                >
                                    <td className="px-6 py-4 font-mono text-xs max-w-[100px] truncate" title={run.id}>{run.id}</td>
                                    <td className="px-6 py-4 font-medium">{run.config}</td>
                                    <td className="px-6 py-4 text-muted-foreground max-w-[150px] truncate" title={run.dataset}>{run.dataset}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="font-mono text-xs">{run.model}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 text-xs">
                                            <span className="bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">F: {run.faithfulness}</span>
                                            <span className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded">R: {run.relevance}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${run.unifiedScore >= 80 ? 'text-green-500' :
                                            run.unifiedScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                            {run.unifiedScore}%
                                        </span>
                                        <span className="text-muted-foreground ml-2 text-xs">
                                            ( Threshold- {run.threshold}%)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${run.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                            run.status === 'Flagged' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {run.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-xs">{run.date}</td>
                                    <td className="px-6 py-4 text-right flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 gap-1 px-2 border-primary/20 hover:border-primary/50"
                                            onClick={(e) => handleCompare(e, run.id)}
                                        >
                                            <GitCompare className="w-3.5 h-3.5" />
                                            <span className="sr-only md:not-sr-only text-xs">Compare</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => handleDownload(e, run.id)}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!isLoading && runs.length === 0 && (
                    <div className="p-12 text-center">
                        <h3 className="text-lg font-semibold">No Runs Found</h3>
                        <p className="text-muted-foreground mb-4">You haven't executed any evaluation runs yet.</p>
                        <Button onClick={() => setIsNewRunModalOpen(true)}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Your First Run
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllRunsPage;
