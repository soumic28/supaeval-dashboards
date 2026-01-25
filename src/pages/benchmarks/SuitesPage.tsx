

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, TrendingUp, BookOpen, Calculator, Code } from 'lucide-react';

const SuitesPage = () => {
    const suites = [
        { id: "mmlu", name: "MMLU", desc: "Massive Multitask Language Understanding", category: "General", items: 57, lastScore: "86.4%", icon: BookOpen },
        { id: "gsm8k", name: "GSM8K", desc: "Grade School Math 8K", category: "Reasoning", items: "8.5k", lastScore: "92.1%", icon: Calculator },
        { id: "humaneval", name: "HumanEval", desc: "Python Coding Problems", category: "Coding", items: 164, lastScore: "78.5%", icon: Code },
        { id: "truthfulqa", name: "TruthfulQA", desc: "Measuring Truthfulness and Hallucinations", category: "Safety", items: 817, lastScore: "65.2%", icon: TrendingUp },
        { id: "hellaswag", name: "HellaSwag", desc: "Commonsense Natural Language Inference", category: "Reasoning", items: "10k", lastScore: "88.9%", icon: BookOpen },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Benchmark Suites</h1>
                    <p className="text-muted-foreground">Standardized benchmarks for evaluating LLM capabilities.</p>
                </div>
                <Button>Import Suite</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suites.map((suite) => (
                    <div key={suite.id} className="border rounded-lg bg-card p-6 space-y-4 hover:border-primary/50 transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <suite.icon className="w-6 h-6" />
                            </div>
                            <Badge variant="outline">{suite.category}</Badge>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">{suite.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{suite.desc}</p>
                        </div>

                        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                            <div className="text-sm">
                                <span className="text-muted-foreground">Last Score: </span>
                                <span className="font-bold text-foreground">{suite.lastScore}</span>
                            </div>
                            <Button size="sm" variant="secondary" className="gap-2">
                                <Play className="w-3 h-3" />
                                Run
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuitesPage;
