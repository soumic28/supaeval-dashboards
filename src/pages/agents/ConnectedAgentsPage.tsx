

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bot, MessageSquare, Activity, Power } from 'lucide-react';

const ConnectedAgentsPage = () => {
    const agents = [
        { id: 1, name: "Agent X", type: "RAG", model: "GPT-4", status: "Active", requests: "12.5k", uptime: "99.9%" },
        { id: 2, name: "Agent Y", type: "Chat", model: "Claude 3", status: "Active", requests: "8.2k", uptime: "99.5%" },
        { id: 3, name: "Agent Z", type: "Analysis", model: "GPT-3.5", status: "Active", requests: "5.1k", uptime: "98.2%" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Connected Agents</h1>
                    <p className="text-muted-foreground">Manage your AI agents connected to the platform.</p>
                </div>
                <Button>
                    <Bot className="w-4 h-4 mr-2" />
                    Connect Agent
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                    <div key={agent.id} className="border rounded-lg bg-card p-6 space-y-4 hover:border-primary/50 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{agent.name}</h3>
                                    <Badge variant="secondary" className="text-xs">{agent.model}</Badge>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${agent.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50">
                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> Requests
                                </div>
                                <div className="font-bold">{agent.requests}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> Uptime
                                </div>
                                <div className="font-bold">{agent.uptime}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">ID: agent_{agent.id}</span>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Power className="w-4 h-4 mr-2" />
                                Disconnect
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectedAgentsPage;
