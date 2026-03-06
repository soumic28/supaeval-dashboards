import { useState, useEffect } from 'react';
import {
    Sheet, SheetContent,
} from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { agentService } from '@/services/agents';
import { layerService, type LayerResponse } from '@/services/layers';
import { metricService } from '@/services/metrics';
import type { Agent } from '@/types/AgentTypes';
import { Plus, BarChart2, Layers, Edit2, Trash2, Bot, ChevronDown, ChevronRight } from 'lucide-react';

interface MapMetricsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent: Agent;
    onSaved: () => void;
    hideDialogWrapper?: boolean;
}

export function MapMetricsDialog({
    open,
    onOpenChange,
    agent,
    onSaved,
    hideDialogWrapper = false
}: MapMetricsDialogProps) {
    // Globals
    const [layers, setLayers] = useState<LayerResponse[]>([]);

    // Selection state
    const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    // Create State
    const [showNewLayerForm, setShowNewLayerForm] = useState(false);
    const [newLayer, setNewLayer] = useState({ name: '', description: '', evaluation_scope: 'agent' });

    // Tracks which layer ID is currently showing the "New Metric" form
    const [activeNewMetricLayerId, setActiveNewMetricLayerId] = useState<string | null>(null);
    const [newMetric, setNewMetric] = useState({ name: '', metric_type: 'custom', judging_prompt: '' });

    const [isCreating, setIsCreating] = useState(false);

    // Edit State
    const [editingBackendLayerId, setEditingBackendLayerId] = useState<string | null>(null);
    const [editingBackendLayerData, setEditingBackendLayerData] = useState({ name: '', description: '', evaluation_scope: '' });

    const [editingBackendMetricId, setEditingBackendMetricId] = useState<string | null>(null);
    const [editingBackendMetricData, setEditingBackendMetricData] = useState({ name: '', metric_type: '', judging_prompt: '' });

    const [showAgentDetails, setShowAgentDetails] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedMetrics(new Set(agent.metrics || []));
            fetchData();
            setShowNewLayerForm(false);
            setActiveNewMetricLayerId(null);
        }
    }, [open, agent]);

    const fetchData = async () => {
        try {
            const l = await layerService.getAll();
            setLayers(l || []);
        } catch (e) {
            console.error("Failed to fetch layers", e);
        }
    };

    const toggleMetric = (metricId: string) => {
        const next = new Set(selectedMetrics);
        if (next.has(metricId)) next.delete(metricId);
        else next.add(metricId);
        setSelectedMetrics(next);
    };

    const handleSaveMapping = async () => {
        setIsSaving(true);
        try {
            const updatedAgent = {
                ...agent,
                metrics: Array.from(selectedMetrics)
            };
            await agentService.update(agent.id, updatedAgent);
            onSaved();
            onOpenChange(false);
        } catch (e) {
            console.error("Failed to save mapping", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateLayer = async () => {
        if (!newLayer.name) return;
        setIsCreating(true);
        try {
            await layerService.create({
                ...newLayer,
                is_active: true
            });
            setNewLayer({ name: '', description: '', evaluation_scope: 'agent' });
            setShowNewLayerForm(false);
            await fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateMetric = async (layerId: string) => {
        if (!newMetric.name) return;
        setIsCreating(true);
        try {
            await metricService.create({
                ...newMetric,
                layer_id: layerId,
                is_active: true
            });
            setNewMetric({ name: '', metric_type: 'custom', judging_prompt: '' });
            setActiveNewMetricLayerId(null);
            await fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteLayer = async (layerId: string) => {
        if (!confirm('Are you sure you want to delete this Layer and all its metrics?')) return;
        try {
            await layerService.delete(layerId);
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateLayer = async (layerId: string) => {
        if (!editingBackendLayerData.name) return;
        try {
            await layerService.update(layerId, editingBackendLayerData);
            setEditingBackendLayerId(null);
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteMetric = async (metricId: string) => {
        if (!confirm('Are you sure you want to delete this Metric?')) return;
        try {
            await metricService.delete(metricId);
            const next = new Set(selectedMetrics);
            if (next.has(metricId)) {
                next.delete(metricId);
                setSelectedMetrics(next);
            }
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateMetric = async (metricId: string) => {
        if (!editingBackendMetricData.name) return;
        try {
            await metricService.update(metricId, editingBackendMetricData);
            setEditingBackendMetricId(null);
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const content = (
        <>
            <div className={cn("p-6 pb-2 shrink-0 flex flex-col gap-1.5", hideDialogWrapper ? "hidden" : "")}>
                <h2 className="text-xl font-semibold leading-none tracking-tight">Configure Layers for {agent.name}</h2>
                <p className="text-sm text-muted-foreground">
                    Map existing metrics to this agent or create new evaluation layers and metrics on the fly.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8 min-h-0">
                {/* Agent Reference Details */}
                {/* ... (rest of the scrollable content) */}
                <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setShowAgentDetails(!showAgentDetails)}
                        className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-sm">Agent Configuration Reference</span>
                        </div>
                        {showAgentDetails ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                    </button>

                    {showAgentDetails && (
                        <div className="p-4 border-t bg-muted/5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Agent Name</Label>
                                    <Input readOnly value={agent.name} className="h-8 bg-muted/20 text-xs text-muted-foreground cursor-not-allowed" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Category</Label>
                                    <Input readOnly value={agent.category} className="h-8 bg-muted/20 text-xs text-muted-foreground cursor-not-allowed" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-xs text-muted-foreground">Description</Label>
                                    <Textarea readOnly value={agent.description || 'No description provided.'} className="min-h-[60px] bg-muted/20 text-xs text-muted-foreground cursor-not-allowed resize-none" />
                                </div>
                                {agent.parallelRuns !== undefined && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Parallel Runs</Label>
                                        <Input readOnly value={agent.parallelRuns} className="h-8 bg-muted/20 text-xs text-muted-foreground cursor-not-allowed" />
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Auth Type</Label>
                                    <Input readOnly value={agent.auth?.type || 'none'} className="h-8 bg-muted/20 text-xs text-muted-foreground cursor-not-allowed uppercase" />
                                </div>
                                {agent.auth?.clientId && (
                                    <div className="space-y-1.5 md:col-span-2">
                                        <Label className="text-xs text-muted-foreground">Client ID</Label>
                                        <Input readOnly value={agent.auth.clientId} className="h-8 bg-muted/20 text-xs text-muted-foreground cursor-not-allowed" />
                                    </div>
                                )}
                                {agent.endpoints && agent.endpoints.length > 0 && (
                                    <div className="space-y-1.5 md:col-span-2">
                                        <Label className="text-xs text-muted-foreground">Endpoints</Label>
                                        <div className="space-y-2">
                                            {agent.endpoints.map(ep => (
                                                <div key={ep.id} className="flex gap-2">
                                                    <Input readOnly value={ep.method} className="h-8 w-20 bg-muted/20 text-xs shrink-0 font-medium text-muted-foreground cursor-not-allowed" />
                                                    <Input readOnly value={ep.url} className="h-8 bg-muted/20 text-xs flex-1 text-muted-foreground cursor-not-allowed" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Layer List */}
                <div className="space-y-8">
                    {layers.length === 0 && !showNewLayerForm && (
                        <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg bg-card/50">
                            <Layers className="h-8 w-8 mx-auto mb-3 opacity-50" />
                            <p>No Evaluation Layers found.</p>
                            <p className="text-sm">Create your first layer to start adding metrics.</p>
                        </div>
                    )}

                    {layers.map(layer => {
                        const layerMetrics = layer.metrics || [];

                        return (
                            <div key={layer.id} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                                {/* Layer Header */}
                                {editingBackendLayerId === layer.id ? (
                                    <div className="pb-3 border-b border-border/50 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-primary" />
                                            <span className="font-semibold text-lg">Edit Layer</span>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Name</Label>
                                                <Input className="h-8" value={editingBackendLayerData.name} onChange={e => setEditingBackendLayerData({ ...editingBackendLayerData, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Scope</Label>
                                                <Input className="h-8" value={editingBackendLayerData.evaluation_scope} onChange={e => setEditingBackendLayerData({ ...editingBackendLayerData, evaluation_scope: e.target.value })} />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <Label className="text-xs">Description</Label>
                                                <Input className="h-8" value={editingBackendLayerData.description} onChange={e => setEditingBackendLayerData({ ...editingBackendLayerData, description: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleUpdateLayer(layer.id)}>Save</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingBackendLayerId(null)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between pb-3 border-b border-border/50 group/header">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-primary" />
                                            <h3 className="font-semibold text-lg">{layer.name}</h3>
                                            {layer.description && <Badge variant="secondary" className="font-normal">{layer.description}</Badge>}
                                        </div>
                                        <div className="flex items-center opacity-0 group-hover/header:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => {
                                                setEditingBackendLayerId(layer.id);
                                                setEditingBackendLayerData({ name: layer.name, description: layer.description || '', evaluation_scope: layer.evaluation_scope });
                                            }}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteLayer(layer.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Mapped Metrics Grid */}
                                {layerMetrics.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {layerMetrics.map(metric => editingBackendMetricId === metric.id ? (
                                            <div key={metric.id} className="col-span-full p-4 border rounded-lg bg-muted/10 space-y-3">
                                                <h4 className="text-sm font-semibold text-primary">Edit Metric</h4>
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Name</Label>
                                                        <Input className="h-8" value={editingBackendMetricData.name} onChange={e => setEditingBackendMetricData({ ...editingBackendMetricData, name: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Type</Label>
                                                        <Input className="h-8" value={editingBackendMetricData.metric_type} onChange={e => setEditingBackendMetricData({ ...editingBackendMetricData, metric_type: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Judging Prompt</Label>
                                                    <Textarea className="min-h-[60px] text-sm" value={editingBackendMetricData.judging_prompt} onChange={e => setEditingBackendMetricData({ ...editingBackendMetricData, judging_prompt: e.target.value })} />
                                                </div>
                                                <div className="flex gap-2 pt-1">
                                                    <Button size="sm" onClick={() => handleUpdateMetric(metric.id)}>Save Metric</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setEditingBackendMetricId(null)}>Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                key={metric.id}
                                                className={`group/metric flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer ${selectedMetrics.has(metric.id) ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted/50'}`}
                                                onClick={() => toggleMetric(metric.id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMetrics.has(metric.id)}
                                                    onChange={() => toggleMetric(metric.id)}
                                                    className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                />
                                                <div className="flex-1 space-y-1 pr-2">
                                                    <p className="text-sm font-medium leading-none">{metric.name}</p>
                                                    <p className="text-xs text-muted-foreground">{metric.metric_type}</p>
                                                </div>
                                                <div className="flex items-start gap-1 opacity-0 group-hover/metric:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => {
                                                        setEditingBackendMetricId(metric.id);
                                                        setEditingBackendMetricData({ name: metric.name, metric_type: metric.metric_type, judging_prompt: metric.judging_prompt || '' });
                                                    }}>
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteMetric(metric.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic py-2">
                                        No metrics created for this layer yet.
                                    </div>
                                )}

                                {/* Inline Create Metric Button/Form */}
                                <div className="pt-2">
                                    {activeNewMetricLayerId === layer.id ? (
                                        <div className="mt-2 p-4 border rounded-lg bg-muted/20 space-y-4">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <BarChart2 className="w-4 h-4 text-primary" /> Create Metric for {layer.name}
                                            </h4>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input value={newMetric.name} onChange={e => setNewMetric({ ...newMetric, name: e.target.value })} placeholder="e.g. Accuracy" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Type</Label>
                                                    <Input value={newMetric.metric_type} onChange={e => setNewMetric({ ...newMetric, metric_type: e.target.value })} placeholder="e.g. custom, llm-as-judge" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Judging Prompt</Label>
                                                <Textarea
                                                    value={newMetric.judging_prompt}
                                                    onChange={e => setNewMetric({ ...newMetric, judging_prompt: e.target.value })}
                                                    placeholder="Enter the evaluation prompt"
                                                    className="min-h-[80px]"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button onClick={() => handleCreateMetric(layer.id)} disabled={isCreating || !newMetric.name} size="sm">
                                                    Save Metric
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setActiveNewMetricLayerId(null)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-primary mt-1"
                                            onClick={() => setActiveNewMetricLayerId(layer.id)}
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add New Metric
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* overarching Create Layer Button/Form */}
                <div className="pt-4 border-t border-border/50">
                    {showNewLayerForm ? (
                        <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Layers className="w-5 h-5 text-primary" /> Create New Evaluation Layer
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={newLayer.name} onChange={e => setNewLayer({ ...newLayer, name: e.target.value })} placeholder="e.g. Logic Layer" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Scope</Label>
                                    <Input value={newLayer.evaluation_scope} onChange={e => setNewLayer({ ...newLayer, evaluation_scope: e.target.value })} placeholder="e.g. agent" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Description</Label>
                                    <Input value={newLayer.description} onChange={e => setNewLayer({ ...newLayer, description: e.target.value })} placeholder="Evaluates logical deductions" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <Button onClick={handleCreateLayer} disabled={isCreating || !newLayer.name}>
                                    Save Layer
                                </Button>
                                <Button variant="ghost" onClick={() => setShowNewLayerForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-dashed"
                            onClick={() => setShowNewLayerForm(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Evaluation Layer
                        </Button>
                    )}
                </div>
            </div>

            <div className={cn("shrink-0 border-t p-6 mt-auto flex justify-end gap-3", hideDialogWrapper ? "bg-background" : "bg-muted/10")}>
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSaveMapping} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Agent Metrics Mapping'}
                </Button>
            </div>
        </>
    );

    if (hideDialogWrapper) {
        return content;
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 p-0">
                {content}
            </SheetContent>
        </Sheet>
    );
}
