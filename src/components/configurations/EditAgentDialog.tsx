import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Save, Plus, Trash2, UserPlus, Brain, Database, Wrench, Users, Plug, Bot, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddTestUserDialog } from '@/components/configurations/AddTestUserDialog';
import type { Agent, AgentCategory, AgentEndpoint, TestUser, AgentMemory } from '@/types/AgentTypes';

interface EditAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent: Agent | null;
    onSave: (agent: Agent) => void;
}

const AGENT_TEMPLATES = [
    {
        name: 'RAG',
        icon: Database,
        category: 'Production' as AgentCategory,
        description: 'Retrieval-Augmented Generation agent for querying knowledge bases.',
        defaultEndpoints: [
            { id: '1', method: 'POST', url: '/api/rag/chat' }
        ] as AgentEndpoint[]
    },
    {
        name: 'RAG + Tools',
        icon: Wrench,
        category: 'Production' as AgentCategory,
        description: 'RAG agent enhanced with external tool capabilities.',
        defaultEndpoints: [
            { id: '1', method: 'POST', url: '/api/rag-tools/chat' }
        ] as AgentEndpoint[]
    },
    {
        name: 'Single Agent',
        icon: Bot,
        category: 'Development' as AgentCategory,
        description: 'A standalone agent for specific tasks without external dependencies.',
        defaultEndpoints: [
            { id: '1', method: 'POST', url: '/api/agent/chat' }
        ] as AgentEndpoint[]
    },
    {
        name: 'Multi Agent',
        icon: Users,
        category: 'Staging' as AgentCategory,
        description: 'Orchestrator for a multi-agent system collaborating on complex tasks.',
        defaultEndpoints: [
            { id: '1', method: 'POST', url: '/api/multi-agent/run' }
        ] as AgentEndpoint[]
    },
    {
        name: 'Custom Adapter',
        icon: Plug,
        category: 'Development' as AgentCategory,
        description: 'Connect your own custom agent implementation via adapter.',
        defaultEndpoints: [] as AgentEndpoint[]
    },
];

export function EditAgentDialog({
    open,
    onOpenChange,
    agent,
    onSave,
}: EditAgentDialogProps) {
    const [editedAgent, setEditedAgent] = useState<Agent | null>(null);
    const [isTestUserDialogOpen, setIsTestUserDialogOpen] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (open) {
            setStep(1);
        }
        if (agent) {
            setEditedAgent({
                ...agent,
                endpoints: agent.endpoints || [],
                auth: agent.auth || { type: 'none' }
            });
        } else {
            // Create new agent
            setEditedAgent({
                id: Date.now().toString(),
                name: '',
                category: 'Development',
                description: '',
                status: 'Active',
                lastActive: 'Just now',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                endpoints: [],
                auth: { type: 'none' }
            });
        }
    }, [agent, open]);

    const handleSave = () => {
        if (!editedAgent || !editedAgent.name.trim()) {
            return;
        }

        const updatedAgent = {
            ...editedAgent,
            updatedAt: new Date().toISOString(),
        };

        onSave(updatedAgent);
        onOpenChange(false);
    };

    const applyTemplate = (templateName: string) => {
        const template = AGENT_TEMPLATES.find(t => t.name === templateName);
        if (!template || !editedAgent) return;

        setEditedAgent({
            ...editedAgent,
            name: template.name,
            category: template.category,
            description: template.description,
            endpoints: template.defaultEndpoints ? [...template.defaultEndpoints] : []
        });
    };

    const addEndpoint = () => {
        if (!editedAgent) return;
        const newEndpoint: AgentEndpoint = {
            id: Date.now().toString(),
            method: 'GET',
            url: ''
        };
        setEditedAgent({
            ...editedAgent,
            endpoints: [...(editedAgent.endpoints || []), newEndpoint]
        });
    };

    const removeEndpoint = (id: string) => {
        if (!editedAgent) return;
        setEditedAgent({
            ...editedAgent,
            endpoints: (editedAgent.endpoints || []).filter(ep => ep.id !== id)
        });
    };

    const updateEndpoint = (id: string, field: keyof AgentEndpoint, value: string) => {
        if (!editedAgent) return;
        setEditedAgent({
            ...editedAgent,
            endpoints: (editedAgent.endpoints || []).map(ep =>
                ep.id === id ? { ...ep, [field]: value } : ep
            )
        });
    };

    const handleAddTestUserClick = () => {
        setIsTestUserDialogOpen(true);
    };

    const handleSaveTestUser = (newTestUser: TestUser) => {
        if (!editedAgent) return;
        setEditedAgent({
            ...editedAgent,
            testUsers: [...(editedAgent.testUsers || []), newTestUser]
        });
        setIsTestUserDialogOpen(false);
    };

    const removeTestUser = (id: string) => {
        if (!editedAgent) return;
        setEditedAgent({
            ...editedAgent,
            testUsers: (editedAgent.testUsers || []).filter(user => user.id !== id)
        });
    };

    const addMemory = () => {
        if (!editedAgent) return;
        const newMemory: AgentMemory = {
            id: Date.now().toString(),
            key: '',
            value: ''
        };
        setEditedAgent({
            ...editedAgent,
            memories: [...(editedAgent.memories || []), newMemory]
        });
    };

    const removeMemory = (id: string) => {
        if (!editedAgent) return;
        setEditedAgent({
            ...editedAgent,
            memories: (editedAgent.memories || []).filter(memory => memory.id !== id)
        });
    };

    const updateMemory = (id: string, field: keyof AgentMemory, value: string) => {
        if (!editedAgent) return;
        setEditedAgent({
            ...editedAgent,
            memories: (editedAgent.memories || []).map(memory =>
                memory.id === id ? { ...memory, [field]: value } : memory
            )
        });
    };

    if (!editedAgent) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[90vw]">
                <DialogHeader>
                    <DialogTitle>
                        {agent ? 'Edit Agent' : 'Create New Agent'}
                    </DialogTitle>
                    <DialogDescription>
                        {agent ? 'Configure your agent details and settings.' : 'Choose a template to get started or configure manually.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="flex gap-2 mt-2 mb-4 px-1">
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-6 px-1">
                    <span className={step >= 1 ? 'text-primary font-medium' : ''}>1. Agent Details</span>
                    <span className={step >= 2 ? 'text-primary font-medium' : ''}>2. Evaluation Profile</span>
                </div>

                <div className="py-2">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {/* Template Selection (only for new agents) */}
                                {!agent && (
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Select a Template</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                            {AGENT_TEMPLATES.map((template) => {
                                                const Icon = template.icon;
                                                const isSelected = editedAgent.name === template.name;
                                                return (
                                                    <motion.div
                                                        key={template.name}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => applyTemplate(template.name)}
                                                        className={`cursor-pointer rounded-lg border-2 p-3 transition-all flex flex-col items-center text-center gap-2 h-full hover:border-primary/50 hover:bg-accent/50 ${isSelected
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border bg-card'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-full ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-sm">{template.name}</h3>
                                                            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                                                                {template.description}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {/* Agent Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-name">Agent Name *</Label>
                                            <Input
                                                id="agent-name"
                                                value={editedAgent.name}
                                                onChange={(e) =>
                                                    setEditedAgent({ ...editedAgent, name: e.target.value })
                                                }
                                                placeholder="Enter agent name"
                                            />
                                        </div>

                                        {/* Agent Category */}
                                        <div className="space-y-2">
                                            <Label>Agent Category</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['Development', 'Staging', 'Production'] as const).map((category) => (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() =>
                                                            setEditedAgent({ ...editedAgent, category })
                                                        }
                                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${editedAgent.category === category
                                                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                                            }`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-description">Description</Label>
                                            <Textarea
                                                id="agent-description"
                                                value={editedAgent.description || ''}
                                                onChange={(e) =>
                                                    setEditedAgent({
                                                        ...editedAgent,
                                                        description: e.target.value,
                                                    })
                                                }
                                                placeholder="Describe what this agent does..."
                                                className="min-h-[100px]"
                                            />
                                        </div>

                                        {/* Parallel Runs for Batch Processing */}
                                        <div className="space-y-2">
                                            <Label htmlFor="parallel-runs">Parallel Runs</Label>
                                            <Input
                                                id="parallel-runs"
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={editedAgent.parallelRuns || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                                                    setEditedAgent({
                                                        ...editedAgent,
                                                        parallelRuns: value
                                                    });
                                                }}
                                                placeholder="e.g., 5"
                                                className="w-full"
                                            />
                                            <p className="text-[10px] text-muted-foreground">
                                                Max parallel batch operations (1-100)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Agent Endpoints */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Endpoints</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addEndpoint}
                                                    className="h-7 text-xs"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Add
                                                </Button>
                                            </div>

                                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                                {(editedAgent.endpoints || []).map((endpoint) => (
                                                    <div key={endpoint.id} className="flex gap-2 items-start">
                                                        <div className="w-20 shrink-0">
                                                            <Select
                                                                value={endpoint.method}
                                                                onChange={(e) => updateEndpoint(endpoint.id, 'method', e.target.value as any)}
                                                                className="w-full h-9 text-xs"
                                                            >
                                                                <option value="GET">GET</option>
                                                                <option value="POST">POST</option>
                                                                <option value="PUT">PUT</option>
                                                                <option value="DELETE">DEL</option>
                                                            </Select>
                                                        </div>
                                                        <Input
                                                            value={endpoint.url}
                                                            onChange={(e) => updateEndpoint(endpoint.id, 'url', e.target.value)}
                                                            placeholder="/api/resource"
                                                            className="flex-1 h-9 text-xs"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeEndpoint(endpoint.id)}
                                                            className="text-muted-foreground hover:text-destructive shrink-0 h-9 w-9"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {(editedAgent.endpoints || []).length === 0 && (
                                                    <div className="text-xs text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                                                        No endpoints configured
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Auth - Client ID & Secret */}
                                        <div className="space-y-2">
                                            <Label>Authentication</Label>
                                            <Select
                                                value={editedAgent.auth?.type || 'none'}
                                                onChange={(e) => setEditedAgent({
                                                    ...editedAgent,
                                                    auth: {
                                                        type: e.target.value as 'none' | 'client_credentials',
                                                        clientId: e.target.value === 'client_credentials' ? (editedAgent.auth?.clientId || '') : undefined,
                                                        clientSecret: e.target.value === 'client_credentials' ? (editedAgent.auth?.clientSecret || '') : undefined
                                                    }
                                                })}
                                                className="w-full h-9 text-xs"
                                            >
                                                <option value="none">None</option>
                                                <option value="client_credentials">Client Credentials</option>
                                            </Select>

                                            {editedAgent.auth?.type === 'client_credentials' && (
                                                <div className="grid grid-cols-1 gap-2 pt-1">
                                                    <Input
                                                        value={editedAgent.auth.clientId || ''}
                                                        onChange={(e) => setEditedAgent({
                                                            ...editedAgent,
                                                            auth: { ...editedAgent.auth, clientId: e.target.value } as any
                                                        })}
                                                        placeholder="Client ID"
                                                        className="h-9 text-xs"
                                                    />
                                                    <Input
                                                        type="password"
                                                        value={editedAgent.auth.clientSecret || ''}
                                                        onChange={(e) => setEditedAgent({
                                                            ...editedAgent,
                                                            auth: { ...editedAgent.auth, clientSecret: e.target.value } as any
                                                        })}
                                                        placeholder="Client Secret"
                                                        className="h-9 text-xs"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {/* Test Users */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Test Users</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleAddTestUserClick}
                                                    className="h-7 text-xs"
                                                >
                                                    <UserPlus className="h-3 w-3 mr-1" />
                                                    Add
                                                </Button>
                                            </div>

                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                {(editedAgent.testUsers || []).map((user) => (
                                                    <div key={user.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-medium">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground line-clamp-1">{user.context}</p>
                                                            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mt-2">
                                                                {user.attributes?.userType && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">Type: {user.attributes.userType}</span>}
                                                                {user.attributes?.riskLevel && <span className="bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded">Risk: {user.attributes.riskLevel}</span>}
                                                                {user.attributes?.intentType && <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">Intent: {user.attributes.intentType}</span>}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeTestUser(user.id)}
                                                            className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {(editedAgent.testUsers || []).length === 0 && (
                                                    <div className="text-xs text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                                                        No test users configured. Add a test user to simulate interactions.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Memories & Context Layers */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Context Layers & Memories</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addMemory}
                                                    className="h-7 text-xs"
                                                >
                                                    <Brain className="h-3 w-3 mr-1" />
                                                    Add Layer
                                                </Button>
                                            </div>

                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                                {(editedAgent.memories || []).map((memory) => (
                                                    <div key={memory.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/30">
                                                        <div className="flex-1 space-y-2">
                                                            <Input
                                                                value={memory.key}
                                                                onChange={(e) => updateMemory(memory.id, 'key', e.target.value)}
                                                                placeholder="Layer Name (e.g., Domain Knowledge)"
                                                                className="w-full font-medium text-xs h-8"
                                                            />
                                                            <Textarea
                                                                value={memory.value}
                                                                onChange={(e) => updateMemory(memory.id, 'value', e.target.value)}
                                                                placeholder="Provide detailed context, guidelines, or memory values..."
                                                                className="w-full min-h-[60px] resize-y text-xs"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeMemory(memory.id)}
                                                            className="text-muted-foreground hover:text-destructive shrink-0 h-8 w-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {(editedAgent.memories || []).length === 0 && (
                                                    <div className="text-xs text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                                                        No context layers or memories defined.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="mt-6 gap-2 sm:gap-0">
                    {step === 1 ? (
                        <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setStep(2)} disabled={!editedAgent.name.trim()}>
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                {agent ? 'Save Changes' : 'Create Agent'}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>

            <AddTestUserDialog
                open={isTestUserDialogOpen}
                onOpenChange={setIsTestUserDialogOpen}
                agentName={editedAgent.name}
                onSave={handleSaveTestUser}
            />
        </Dialog>
    );
}

