import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Settings, Plus, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ConfigsPage() {
    const { toast } = useToast();
    const configs = [
        { id: 1, name: "Production Chatbot", model: "GPT-4-Turbo", metrics: ["Faithfulness", "Relevance", "Tone"], updated: "2 days ago" },
        { id: 2, name: "Staging RAG", model: "Claude 3 Haiku", metrics: ["Recall@5", "Precision@5", "Answer Correctness"], updated: "5 days ago" },
        { id: "3", name: "Code Generator Eval", model: "DeepSeek Coder", metrics: ["Code Validity", "Security Check"], updated: "1 week ago" },
    ];

    const handleCreate = () => {
        toast({
            title: "Create Configuration",
            description: "This feature is coming soon! You'll be able to define custom evaluation metrics and model settings.",
        });
    };

    const handleEdit = (name: string) => {
        toast({
            title: "Edit Configuration",
            description: `Editing ${name} is currently disabled in this demo.`,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurations</h1>
                    <p className="text-muted-foreground">Manage your evaluation settings and metric definitions.</p>
                </div>
                <Button className="w-full md:w-auto" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Config
                </Button>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {configs.map((config) => (
                    <Card key={config.id} className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => handleEdit(config.name)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                {config.name}
                            </CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Zap className="h-3 w-3" />
                                <span>{config.model}</span>
                            </div>

                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Metrics</p>
                                <div className="flex flex-wrap gap-2">
                                    {config.metrics.map((metric) => (
                                        <Badge key={metric} variant="secondary" className="text-xs">
                                            {metric}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Updated {config.updated}</span>
                                <Button variant="ghost" size="sm" className="h-6 px-2" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(config.name);
                                }}>Edit</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button
                    className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-6 hover:bg-accent/50 hover:border-primary/50 transition-all h-full min-h-[200px]"
                    onClick={handleCreate}
                >
                    <div className="rounded-full bg-background p-3 mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Create New Configuration</span>
                </button>
            </div>
        </div>
    );
}
