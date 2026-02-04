
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Filter, Download, GitCompare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { NewRunModal } from '@/components/evaluations/NewRunModal';
import { useState } from 'react';

const AllRunsPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isNewRunModalOpen, setIsNewRunModalOpen] = useState(false);

    const runs = [
        { id: "run_8492", config: "Prod Chatbot v2", dataset: "Customer Logs Q4", model: "GPT-4-Turbo", faithfulness: 0.92, relevance: 0.88, status: "Completed", date: "2 mins ago", unifiedScore: 85, threshold: 65 },
        { id: "run_8491", config: "Staging RAG", dataset: "Wiki Subset", model: "Claude 3 Haiku", faithfulness: 0.85, relevance: 0.91, status: "Completed", date: "1 hour ago", unifiedScore: 78, threshold: 65 },
        { id: "run_8490", config: "Code Eval", dataset: "Python Snippets", model: "DeepSeek Coder", faithfulness: 0.95, relevance: 0.94, status: "Completed", date: "3 hours ago", unifiedScore: 92, threshold: 65 },
        { id: "run_8489", config: "Prod Chatbot v2", dataset: "Adversarial Set", model: "GPT-4-Turbo", faithfulness: 0.78, relevance: 0.82, status: "Flagged", date: "5 hours ago", unifiedScore: 45, threshold: 65 },
        { id: "run_8488", config: "Exp: Llama 3", dataset: "General QA", model: "Llama-3-70b", faithfulness: 0.81, relevance: 0.79, status: "Completed", date: "1 day ago", unifiedScore: 68, threshold: 65 },
        { id: "run_8487", config: "Staging RAG", dataset: "Legal Corpus", model: "Claude 3 Opus", faithfulness: 0.96, relevance: 0.95, status: "Completed", date: "1 day ago", unifiedScore: 88, threshold: 65 },
    ];

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
                                onClick={() => navigate('/evaluations/run-details')}
                            >
                                <td className="px-6 py-4 font-mono text-xs">{run.id}</td>
                                <td className="px-6 py-4 font-medium">{run.config}</td>
                                <td className="px-6 py-4 text-muted-foreground">{run.dataset}</td>
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
            </div>
        </div>
    );
};

export default AllRunsPage;
