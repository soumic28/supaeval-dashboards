import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Bot, Plus, Settings, Trash2, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditAgentDialog } from '@/components/configurations/EditAgentDialog';
import type { Agent } from '@/types/AgentTypes';
import { agentService } from '@/services/agents';

export default function AgentConfigPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const data = await agentService.getAll();
            setAgents(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch agents:', err);
            // Graceful failure: set agents to empty list so UI can still be used for creation
            setAgents([]);
            setError('Unable to list existing agents due to backend error. You can still create new agents. If you know the ID of the corrupted agent, use the Force Delete tool below.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleCreateAgent = () => {
        setSelectedAgent(null);
        setIsEditDialogOpen(true);
    };

    const handleEditAgent = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsEditDialogOpen(true);
    };

    const handleSaveAgent = async (updatedAgent: Agent) => {
        try {
            if (selectedAgent) {
                // Update
                const savedAgent = await agentService.update(updatedAgent.id, updatedAgent);
                setAgents((prev) => prev.map((a) => (a.id === savedAgent.id ? savedAgent : a)));
            } else {
                // Create
                const savedAgent = await agentService.create(updatedAgent);
                setAgents((prev) => [...prev, savedAgent]);
            }
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error('Failed to save agent:', err);
            // Ideally show a toast here
            alert('Failed to save agent');
        }
    };

    const handleDeleteClick = (agent: Agent, e: React.MouseEvent) => {
        e.stopPropagation();
        setAgentToDelete(agent);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (agentToDelete) {
            try {
                await agentService.delete(agentToDelete.id);
                setAgents((prev) => prev.filter((a) => a.id !== agentToDelete.id));
                setDeleteDialogOpen(false);
                setAgentToDelete(null);
            } catch (err) {
                console.error('Failed to delete agent:', err);
                alert('Failed to delete agent');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Idle':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Error':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500';
            case 'Idle':
                return 'bg-yellow-500';
            case 'Error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agent Configuration</h1>
                    <p className="text-muted-foreground">
                        Onboard, create, update, and manage your agents.
                    </p>
                </div>
                <Button className="w-full md:w-auto" onClick={handleCreateAgent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Onboard Agent
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : (
                /* Agent Cards Grid */
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
                                <Card className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="flex-1" onClick={() => handleEditAgent(agent)}>
                                            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                                {agent.name}
                                            </CardTitle>
                                            {agent.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {agent.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEditAgent(agent)}
                                                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                            >
                                                <Settings className="h-4 w-4 text-muted-foreground" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => handleDeleteClick(agent, e)}
                                                className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </motion.button>
                                        </div>
                                    </CardHeader>
                                    <CardContent onClick={() => handleEditAgent(agent)}>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Bot className="h-3 w-3" />
                                            <span>{agent.category}</span>
                                        </div>

                                        {agent.parallelRuns && (
                                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                <Zap className="h-3 w-3" />
                                                <span>{agent.parallelRuns} parallel runs</span>
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getStatusColor(agent.status)}`}
                                            >
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(
                                                        agent.status
                                                    )} ${agent.status === 'Active' ? 'animate-pulse' : ''}`}
                                                />
                                                {agent.status}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                Active {agent.lastActive}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Create New Agent Card */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: agents.length * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateAgent}
                        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-6 hover:bg-accent/50 hover:border-primary/50 transition-all h-full min-h-[200px]"
                    >
                        <div className="rounded-full bg-background p-3 mb-3">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            Create New Agent
                        </span>
                    </motion.button>
                </div>
            )}

            {/* Emergency Cleanup Tool */}
            <div className="mt-12 pt-8 border-t">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Emergency Cleanup (Force Delete)
                </h2>
                <div className="p-4 bg-muted/50 rounded-lg max-w-xl">
                    <p className="text-sm text-muted-foreground mb-4">
                        If the Agent List is failing (500 Error) due to corrupted data, enter the Agent ID here to force delete it.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Paste Agent UUID here..."
                            className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
                            id="force-delete-input"
                        />
                        <Button
                            variant="destructive"
                            onClick={() => {
                                const input = document.getElementById('force-delete-input') as HTMLInputElement;
                                if (input?.value) {
                                    if (confirm(`Force delete agent ${input.value}?`)) {
                                        agentService.delete(input.value)
                                            .then(() => {
                                                alert('Agent deleted successfully. Refreshing...');
                                                window.location.reload();
                                            })
                                            .catch(err => alert('Failed to delete: ' + err.message));
                                    }
                                }
                            }}
                        >
                            Force Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Agent Dialog */}
            <EditAgentDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                agent={selectedAgent}
                onSave={handleSaveAgent}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Delete Agent
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground">
                                {agentToDelete?.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Agent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
