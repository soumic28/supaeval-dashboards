import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';

const comparisonData = {
    input: [
        { metric: 'Intent Accuracy', runA: '98%', runB: '95%', diff: '-3%' },
        { metric: 'Constraint Adherence', runA: '92%', runB: '88%', diff: '-4%' },
        { metric: 'Ambiguity Detection', runA: '88%', runB: '90%', diff: '+2%' },
    ],
    planning: [
        { metric: 'Plan Accuracy', runA: '94%', runB: '89%', diff: '-5%' },
        { metric: 'Step Coverage', runA: '96%', runB: '92%', diff: '-4%' },
        { metric: 'Hallucinated Steps', runA: '2%', runB: '5%', diff: '+3%' },
    ],
    retrieval: [
        { metric: 'Recall@K', runA: '0.85', runB: '0.82', diff: '-0.03' },
        { metric: 'Precision@K', runA: '0.91', runB: '0.88', diff: '-0.03' },
        { metric: 'Context Relevance', runA: '9.2/10', runB: '8.5/10', diff: '-0.7' },
    ],
    generation: [
        { metric: 'Response Quality', runA: '4.8/5', runB: '4.5/5', diff: '-0.3' },
        { metric: 'Hallucination Rate', runA: '0.5%', runB: '1.2%', diff: '+0.7%' },
        { metric: 'Toxicity Score', runA: '0.01', runB: '0.01', diff: '0' },
    ],
    system: [
        { metric: 'Latency (avg)', runA: '1.2s', runB: '1.8s', diff: '+0.6s' },
        { metric: 'Cost per Run', runA: '$0.02', runB: '$0.018', diff: '-$0.002' },
        { metric: 'Error Rate', runA: '0.1%', runB: '0.5%', diff: '+0.4%' },
    ],
};

const ComparisonsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const runId = searchParams.get('runId') || 'run_8492';
    const baselineId = 'run_baseline_v1';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="p-0" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Run Comparison</h1>
                    <p className="text-muted-foreground">Comparing {runId} vs {baselineId} (Baseline)</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(comparisonData).map(([layer, metrics]) => (
                    <Card key={layer} className="overflow-hidden">
                        <CardHeader className="bg-muted/20 pb-4">
                            <CardTitle className="capitalize flex items-center gap-2">
                                {layer} Layer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Metric</th>
                                        <th className="px-4 py-2 text-right font-medium">{runId}</th>
                                        <th className="px-4 py-2 text-right font-medium">{baselineId}</th>
                                        <th className="px-4 py-2 text-right font-medium">Diff</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {metrics.map((item, i) => (
                                        <tr key={i} className="hover:bg-muted/10">
                                            <td className="px-4 py-3 text-muted-foreground font-medium">{item.metric}</td>
                                            <td className="px-4 py-3 text-right font-mono">{item.runA}</td>
                                            <td className="px-4 py-3 text-right font-mono text-muted-foreground">{item.runB}</td>
                                            <td className={`px-4 py-3 text-right font-mono ${item.diff.startsWith('+') && !item.metric.includes('Latency') && !item.metric.includes('Error') && !item.metric.includes('Hallucination') ? 'text-green-500' :
                                                    item.diff.startsWith('-') && (item.metric.includes('Latency') || item.metric.includes('Error') || item.metric.includes('Hallucination')) ? 'text-green-500' :
                                                        item.diff === '0' ? 'text-muted-foreground' : 'text-red-500'
                                                }`}>
                                                {item.diff}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ComparisonsPage;
