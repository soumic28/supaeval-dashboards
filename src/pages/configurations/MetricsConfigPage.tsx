import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart2, Blocks, Database, LayoutGrid, Layers, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapMetricsDialog } from '@/components/configurations/MapMetricsDialog';
import type { Agent } from '@/types/AgentTypes';
import { agentService } from '@/services/agents';

export default function MetricsConfigPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        try {
            const data = await agentService.getAll();
            setAgents(data);
        } catch (err) {
            console.error("Failed to load agents", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditAgentMetrics = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsDialogOpen(true);
    };

    const getIconForCategory = (category: string) => {
        switch (category) {
            case 'Production': return <Database className="h-5 w-5 text-primary" />;
            case 'Staging': return <Layers className="h-5 w-5 text-primary" />;
            default: return <Blocks className="h-5 w-5 text-primary" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Evaluation Layers Configuration</h1>
                    <p className="text-muted-foreground">Configure evaluation layers for mapping agents.</p>
                </div>
            </div>

            {/* Agents Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            layout
                        >
                            <Card
                                className="hover:border-primary/50 transition-all group flex flex-col h-full"
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 border rounded-md group-hover:bg-primary/5 transition-colors">
                                            {getIconForCategory(agent.category)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                                {agent.name}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-0.5">{agent.category}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-end pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge variant={agent.metrics?.length ? "default" : "secondary"} className="text-xs whitespace-nowrap">
                                            <BarChart2 className="w-3 h-3 mr-1 shrink-0" />
                                            {agent.metrics?.length || 0} Layers Mapped
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                            <CircleDot className={`w-3 h-3 shrink-0 ${agent.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`} />
                                            {agent.status}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={() => handleEditAgentMetrics(agent)}
                                    >
                                        Configure Layers
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!loading && agents.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-center bg-card/50">
                        <LayoutGrid className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No Agents Found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            You need to create an agent first before you can map evaluation layers to it.
                        </p>
                    </div>
                )}
            </div>

            {/* Map Metrics Dialog */}
            {selectedAgent && (
                <MapMetricsDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    agent={selectedAgent}
                    onSaved={loadAgents}
                />
            )}
        </div>
    );
}
