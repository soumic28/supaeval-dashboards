import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Bot, Plus, Settings } from 'lucide-react';

export default function AgentConfigPage() {
    const agents = [
        { id: 1, name: "Customer Support Bot", type: "Chat", status: "Active", lastActive: "2 mins ago" },
        { id: 2, name: "Data Analyst", type: "Analysis", status: "Idle", lastActive: "1 hour ago" },
        { id: 3, name: "Code Reviewer", type: "Development", status: "Active", lastActive: "5 mins ago" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agent Configuration</h1>
                    <p className="text-muted-foreground">Onboard, create, update, and manage your agents.</p>
                </div>
                <Button className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Onboard Agent
                </Button>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                    <Card key={agent.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                {agent.name}
                            </CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <Bot className="h-3 w-3" />
                                <span>{agent.type}</span>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <Badge variant={agent.status === "Active" ? "default" : "secondary"} className="text-xs">
                                    {agent.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Active {agent.lastActive}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-6 hover:bg-accent/50 hover:border-primary/50 transition-all h-full min-h-[200px]">
                    <div className="rounded-full bg-background p-3 mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Create New Agent</span>
                </button>
            </div>
        </div>
    );
}
