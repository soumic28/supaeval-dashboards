import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Plus, Upload, FileText, MessageSquare, Database, Download } from 'lucide-react';

export default function DatasetsPage() {
    const myDatasets = [
        { id: 1, name: "Customer Support V1", type: "Conversation", size: "1.2k samples", updated: "2 days ago", status: "Ready" },
        { id: 2, name: "RAG Golden Set", type: "QA Pairs", size: "500 samples", updated: "1 week ago", status: "Ready" },
        { id: 3, name: "Hallucination Test", type: "Prompts", size: "150 samples", updated: "3 weeks ago", status: "Draft" },
    ];

    const marketplaceDatasets = [
        { id: 101, name: "MMLU (General)", type: "Benchmark", size: "14k samples", author: "SupaEval", downloads: "12k" },
        { id: 102, name: "TruthfulQA", type: "Benchmark", size: "800 samples", author: "SupaEval", downloads: "8.5k" },
        { id: 103, name: "GSM8K (Math)", type: "Benchmark", size: "8.5k samples", author: "OpenAI", downloads: "15k" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
                    <p className="text-muted-foreground">Manage your evaluation datasets and benchmarks.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button className="flex-1 md:flex-none">
                        <Plus className="mr-2 h-4 w-4" />
                        New Dataset
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="my-datasets">
                <TabsList>
                    <TabsTrigger value="my-datasets">My Datasets</TabsTrigger>
                    <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                </TabsList>

                <TabsContent value="my-datasets" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {myDatasets.map((dataset) => (
                            <Card key={dataset.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium">
                                        {dataset.name}
                                    </CardTitle>
                                    {dataset.type === 'Conversation' ? <MessageSquare className="h-4 w-4 text-muted-foreground" /> :
                                        dataset.type === 'QA Pairs' ? <Database className="h-4 w-4 text-muted-foreground" /> :
                                            <FileText className="h-4 w-4 text-muted-foreground" />}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mt-2">
                                        <Badge variant="secondary">{dataset.type}</Badge>
                                        <span className="text-xs text-muted-foreground">{dataset.updated}</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                        <span>{dataset.size}</span>
                                        <Badge variant={dataset.status === 'Ready' ? 'success' : 'outline'}>{dataset.status}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="marketplace" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {marketplaceDatasets.map((dataset) => (
                            <Card key={dataset.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium">
                                        {dataset.name}
                                    </CardTitle>
                                    <Badge variant="outline">Public</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm text-muted-foreground">{dataset.author}</span>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Download className="mr-1 h-3 w-3" /> {dataset.downloads}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">{dataset.size}</span>
                                        <Button size="sm" variant="secondary">Add to Library</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
