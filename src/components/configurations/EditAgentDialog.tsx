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
import { Save, Plus, Trash2 } from 'lucide-react';
import type { Agent, AgentCategory, AgentEndpoint } from '@/types/AgentTypes';

interface EditAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent: Agent | null;
    onSave: (agent: Agent) => void;
}

const AGENT_TEMPLATES = [
    {
        name: 'Customer Support Bot',
        category: 'Production' as AgentCategory,
        description: 'Handles customer inquiries and provides support across multiple channels.',
        defaultEndpoints: [
            { id: '1', method: 'POST', url: '/api/chat' }
        ] as AgentEndpoint[]
    },
    {
        name: 'Data Analyst',
        category: 'Staging' as AgentCategory,
        description: 'Analyzes data patterns, generates insights, and creates reports.',
        defaultEndpoints: [] as AgentEndpoint[]
    },
    {
        name: 'Code Reviewer',
        category: 'Development' as AgentCategory,
        description: 'Reviews code for quality, security, and best practices.',
        defaultEndpoints: [
            { id: '1', method: 'POST', url: '/api/review' }
        ] as AgentEndpoint[]
    },
];

export function EditAgentDialog({
    open,
    onOpenChange,
    agent,
    onSave,
}: EditAgentDialogProps) {
    const [editedAgent, setEditedAgent] = useState<Agent | null>(null);

    useEffect(() => {
        if (agent) {
            setEditedAgent({
                ...agent,
                endpoints: agent.endpoints || [],
                auth: agent.auth || { type: 'none' }
            });
        } else {
            // Create new agent
            setEditedAgent({
                id: Date.now(),
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

    if (!editedAgent) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {agent ? 'Edit Agent' : 'Create New Agent'}
                    </DialogTitle>
                    <DialogDescription>
                        Configure your agent's details, endpoints, and authentication settings.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Template Selection (only for new agents) */}
                    {!agent && (
                        <div className="space-y-2">
                            <Label>Quick Start Template (Optional)</Label>
                            <Select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        applyTemplate(e.target.value);
                                    }
                                }}
                                value=""
                            >
                                <option value="">Select a template...</option>
                                {AGENT_TEMPLATES.map((template) => (
                                    <option key={template.name} value={template.name}>
                                        {template.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    )}

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

                    {/* Agent Endpoints */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Agent Endpoints</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addEndpoint}
                                className="h-8"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Endpoint
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {(editedAgent.endpoints || []).map((endpoint) => (
                                <div key={endpoint.id} className="flexgap-2 items-start flex gap-2">
                                    <div className="w-24 shrink-0">
                                        <Select
                                            value={endpoint.method}
                                            onChange={(e) => updateEndpoint(endpoint.id, 'method', e.target.value as any)}
                                            className="w-full"
                                        >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                            <option value="PUT">PUT</option>
                                            <option value="DELETE">DELETE</option>
                                            <option value="PATCH">PATCH</option>
                                            <option value="HEAD">HEAD</option>
                                            <option value="OPTIONS">OPTIONS</option>
                                        </Select>
                                    </div>
                                    <Input
                                        value={endpoint.url}
                                        onChange={(e) => updateEndpoint(endpoint.id, 'url', e.target.value)}
                                        placeholder="/api/v1/resource"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEndpoint(endpoint.id)}
                                        className="text-muted-foreground hover:text-destructive shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {(editedAgent.endpoints || []).length === 0 && (
                                <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                                    No endpoints configured
                                </div>
                            )}
                        </div>
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
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${editedAgent.category === category
                                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Auth - Client ID & Secret */}
                    <div className="space-y-4">
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
                            >
                                <option value="none">None</option>
                                <option value="client_credentials">Client Credentials</option>
                            </Select>
                        </div>

                        {editedAgent.auth?.type === 'client_credentials' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="client-id">Client ID</Label>
                                    <Input
                                        id="client-id"
                                        value={editedAgent.auth.clientId || ''}
                                        onChange={(e) => setEditedAgent({
                                            ...editedAgent,
                                            auth: { ...editedAgent.auth, clientId: e.target.value } as any
                                        })}
                                        placeholder="Enter Client ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client-secret">Client Secret</Label>
                                    <Input
                                        id="client-secret"
                                        type="password"
                                        value={editedAgent.auth.clientSecret || ''}
                                        onChange={(e) => setEditedAgent({
                                            ...editedAgent,
                                            auth: { ...editedAgent.auth, clientSecret: e.target.value } as any
                                        })}
                                        placeholder="Enter Client Secret"
                                    />
                                </div>
                            </div>
                        )}
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
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!editedAgent.name.trim()}>
                        <Save className="mr-2 h-4 w-4" />
                        {agent ? 'Save Changes' : 'Create Agent'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
