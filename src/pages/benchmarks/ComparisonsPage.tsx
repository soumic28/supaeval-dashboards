

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const ComparisonsPage = () => {
    const data = [
        { name: 'MMLU', GPT4: 86.4, Claude3: 82.1, Llama3: 79.5 },
        { name: 'GSM8K', GPT4: 92.0, Claude3: 88.5, Llama3: 84.2 },
        { name: 'HumanEval', GPT4: 85.2, Claude3: 78.9, Llama3: 72.4 },
        { name: 'TruthfulQA', GPT4: 65.0, Claude3: 68.2, Llama3: 59.8 },
        { name: 'HellaSwag', GPT4: 95.3, Claude3: 93.1, Llama3: 91.2 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Model Comparison</h1>
                <p className="text-muted-foreground">Compare performance across different models and benchmarks.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Benchmark Scores by Model</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                            <Bar dataKey="GPT4" fill="#8884d8" name="GPT-4 Turbo" />
                            <Bar dataKey="Claude3" fill="#82ca9d" name="Claude 3 Opus" />
                            <Bar dataKey="Llama3" fill="#ffc658" name="Llama 3 70B" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {['GPT-4 Turbo', 'Claude 3 Opus', 'Llama 3 70B'].map((model, i) => (
                    <div key={model} className="border rounded-lg p-6 bg-card text-center space-y-2">
                        <div className="text-sm text-muted-foreground">Average Score</div>
                        <div className="text-3xl font-bold" style={{ color: ['#8884d8', '#82ca9d', '#ffc658'][i] }}>
                            {[84.7, 82.1, 77.4][i]}%
                        </div>
                        <div className="font-medium">{model}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComparisonsPage;
