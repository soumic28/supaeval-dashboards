import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, CheckCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHome() {
    const stats = [
        { title: "Quality Score", value: "87%", change: "+2.4%", trend: "up", icon: Activity },
        { title: "Pass Rate", value: "94.2%", change: "+1.1%", trend: "up", icon: CheckCircle },
        { title: "Eval Runs", value: "128", change: "-12", trend: "down", icon: Clock },
        { title: "Avg Latency", value: "1.2s", change: "-0.3s", trend: "up", icon: Clock },
    ];

    const recentRuns = [
        { id: "run-1023", name: "Customer Support Bot v2", status: "success", score: "92%", time: "2 mins ago" },
        { id: "run-1022", name: "RAG Pipeline Alpha", status: "failed", score: "45%", time: "15 mins ago" },
        { id: "run-1021", name: "Sales Agent", status: "success", score: "88%", time: "1 hour ago" },
        { id: "run-1020", name: "Code Assistant", status: "running", score: "-", time: "Running" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your agent performance and evaluation runs.</p>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    <span className="font-medium">
                                        {stat.trend === 'up' ? '+' : ''}{stat.change}
                                    </span>
                                    <span className="ml-1">from last month</span>
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Evaluations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentRuns.map((run) => (
                                <div key={run.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Activity className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{run.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{run.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={run.status === 'success' ? 'success' : run.status === 'failed' ? 'destructive' : 'secondary'}>
                                            {run.status}
                                        </Badge>
                                        <div className="text-sm font-medium w-12 text-right">{run.score}</div>
                                        <div className="text-xs text-muted-foreground w-20 text-right">{run.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Coverage Gaps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Retrieval Accuracy</span>
                                    <span className="font-medium">78%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground w-[78%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Hallucination Rate</span>
                                    <span className="font-medium">2.1%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground w-[98%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Tool Usage</span>
                                    <span className="font-medium">95%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground w-[95%]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
