import { QualityTrendChart } from '@/components/charts/QualityTrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function DashboardsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
                <p className="text-muted-foreground">Deep dive into your agent's performance metrics.</p>
            </div>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="retrieval">Retrieval</TabsTrigger>
                    <TabsTrigger value="generation">Generation</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <QualityTrendChart />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Failure Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-foreground" />
                                            <span className="text-sm">Hallucination</span>
                                        </div>
                                        <span className="font-bold">42%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                                            <span className="text-sm">Retrieval Miss</span>
                                        </div>
                                        <span className="font-bold">35%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full border border-border" />
                                            <span className="text-sm">Tool Error</span>
                                        </div>
                                        <span className="font-bold">23%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Top Failing Prompts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { prompt: "Explain the refund policy for digital goods...", error: "Hallucination", count: 12 },
                                        { prompt: "Compare plan A and plan B features...", error: "Retrieval Miss", count: 8 },
                                        { prompt: "Cancel my subscription immediately...", error: "Tool Error", count: 5 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium truncate max-w-[300px]">{item.prompt}</p>
                                                <Badge variant="outline" className="text-xs">{item.error}</Badge>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold">{item.count}</span>
                                                <span className="text-xs text-muted-foreground block">failures</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="retrieval">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Retrieval metrics visualization placeholder.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="generation">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground">Generation metrics visualization placeholder.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
