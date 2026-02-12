import { useState } from 'react';
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
import { Bot, Plus, Settings, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditAgentDialog } from '@/components/configurations/EditAgentDialog';
import type { Agent } from '@/types/AgentTypes';

export default function AgentConfigPage() {
    const [agents, setAgents] = useState<Agent[]>([
        {
            id: 1,
            name: 'Customer Support Bot',
            category: 'Production',
            description: 'Handles customer inquiries and provides support across multiple channels.',
            status: 'Active',
            lastActive: '2 mins ago',
            createdAt: '2026-02-01T10:00:00Z',
            updatedAt: '2026-02-05T18:00:00Z',
            endpoints: [
                { id: '1', method: 'POST', url: '/api/v1/chat' },
                { id: '2', method: 'GET', url: '/api/v1/status' }
            ],
            auth: { type: 'client_credentials', clientId: 'client_123', clientSecret: '******' }
        },
        {
            id: 2,
            name: 'Data Analyst',
            category: 'Staging',
            description: 'Analyzes data patterns, generates insights, and creates reports.',
            status: 'Idle',
            lastActive: '1 hour ago',
            createdAt: '2026-02-02T10:00:00Z',
            updatedAt: '2026-02-04T18:00:00Z',
            endpoints: [],
            auth: { type: 'none' }
        },
        {
            id: 3,
            name: 'Code Reviewer',
            category: 'Development',
            description: 'Reviews code for quality, security, and best practices.',
            status: 'Active',
            lastActive: '5 mins ago',
            createdAt: '2026-02-03T10:00:00Z',
            updatedAt: '2026-02-05T18:00:00Z',
            endpoints: [
                { id: '3', method: 'POST', url: '/api/v1/review' }
            ],
            auth: { type: 'client_credentials', clientId: 'client_456', clientSecret: '******' }
        },
    ]);

    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

    const handleCreateAgent = () => {
        setSelectedAgent(null);
        setIsEditDialogOpen(true);
    };

    const handleEditAgent = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsEditDialogOpen(true);
    };

    const handleSaveAgent = (updatedAgent: Agent) => {
        setAgents((prev) => {
            const existingIndex = prev.findIndex((a) => a.id === updatedAgent.id);
            if (existingIndex >= 0) {
                // Update existing
                const newAgents = [...prev];
                newAgents[existingIndex] = updatedAgent;
                return newAgents;
            } else {
                // Add new
                return [...prev, updatedAgent];
            }
        });
    };

    const handleDeleteClick = (agent: Agent, e: React.MouseEvent) => {
        e.stopPropagation();
        setAgentToDelete(agent);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (agentToDelete) {
            setAgents((prev) => prev.filter((a) => a.id !== agentToDelete.id));
            setDeleteDialogOpen(false);
            setAgentToDelete(null);
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

            {/* Agent Cards Grid */}
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
