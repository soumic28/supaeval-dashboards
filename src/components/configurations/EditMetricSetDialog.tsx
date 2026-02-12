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
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Trash2, Layers, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import type { CustomLayer, CustomMetric, MetricSet, MetricType } from '@/types/MetricTypes';
import { DEFAULT_METRIC_TEMPLATES, getDefaultPromptByType } from '@/config/defaultMetrics';

interface EditMetricSetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    metricSet: MetricSet | null;
    onSave: (metricSet: MetricSet) => void;
}

export function EditMetricSetDialog({
    open,
    onOpenChange,
    metricSet,
    onSave,
}: EditMetricSetDialogProps) {
    const [editedMetricSet, setEditedMetricSet] = useState<MetricSet | null>(null);
    const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (metricSet) {
            setEditedMetricSet({ ...metricSet });
            // Expand all layers by default
            const allLayerIds = metricSet.layers.map(l => l.id);
            setExpandedLayers(new Set(allLayerIds));
        } else {
            // Create new metric set
            setEditedMetricSet({
                id: Date.now(),
                name: 'New Metric Set',
                type: 'Custom',
                count: 0,
                updated: 'Just now',
                layers: [],
            });
            setExpandedLayers(new Set());
        }
    }, [metricSet, open]);

    const toggleLayer = (layerId: string) => {
        setExpandedLayers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(layerId)) {
                newSet.delete(layerId);
            } else {
                newSet.add(layerId);
            }
            return newSet;
        });
    };

    const addLayer = () => {
        if (!editedMetricSet) return;

        const newLayer: CustomLayer = {
            id: `layer-${Date.now()}`,
            name: 'New Layer',
            metrics: [],
        };

        setEditedMetricSet({
            ...editedMetricSet,
            layers: [...editedMetricSet.layers, newLayer],
        });
        setExpandedLayers(prev => new Set([...prev, newLayer.id]));
    };

    const deleteLayer = (layerId: string) => {
        if (!editedMetricSet) return;

        setEditedMetricSet({
            ...editedMetricSet,
            layers: editedMetricSet.layers.filter(l => l.id !== layerId),
        });
    };

    const updateLayerName = (layerId: string, name: string) => {
        if (!editedMetricSet) return;

        setEditedMetricSet({
            ...editedMetricSet,
            layers: editedMetricSet.layers.map(l =>
                l.id === layerId ? { ...l, name } : l
            ),
        });
    };

    const addMetric = (layerId: string) => {
        if (!editedMetricSet) return;

        const newMetric: CustomMetric = {
            id: `metric-${Date.now()}`,
            name: 'New Metric',
            type: 'LLM-as-Judge',
            judgingPrompt: getDefaultPromptByType('LLM-as-Judge'),
        };

        setEditedMetricSet({
            ...editedMetricSet,
            layers: editedMetricSet.layers.map(l =>
                l.id === layerId
                    ? { ...l, metrics: [...l.metrics, newMetric] }
                    : l
            ),
        });
    };

    const deleteMetric = (layerId: string, metricId: string) => {
        if (!editedMetricSet) return;

        setEditedMetricSet({
            ...editedMetricSet,
            layers: editedMetricSet.layers.map(l =>
                l.id === layerId
                    ? { ...l, metrics: l.metrics.filter(m => m.id !== metricId) }
                    : l
            ),
        });
    };

    const updateMetric = (
        layerId: string,
        metricId: string,
        updates: Partial<CustomMetric>
    ) => {
        if (!editedMetricSet) return;

        setEditedMetricSet({
            ...editedMetricSet,
            layers: editedMetricSet.layers.map(l =>
                l.id === layerId
                    ? {
                        ...l,
                        metrics: l.metrics.map(m =>
                            m.id === metricId ? { ...m, ...updates } : m
                        ),
                    }
                    : l
            ),
        });
    };

    const applyDefaultTemplate = (layerId: string, metricId: string, templateName: string) => {
        const template = DEFAULT_METRIC_TEMPLATES.find(t => t.name === templateName);
        if (!template) return;

        updateMetric(layerId, metricId, {
            name: template.name,
            type: template.type,
            judgingPrompt: template.judgingPrompt,
        });
    };

    const handleMetricTypeChange = (layerId: string, metricId: string, type: MetricType) => {
        updateMetric(layerId, metricId, {
            type,
            judgingPrompt: getDefaultPromptByType(type),
        });
    };

    const handleSave = () => {
        if (!editedMetricSet) return;

        // Update count based on total metrics
        const totalMetrics = editedMetricSet.layers.reduce(
            (sum, layer) => sum + layer.metrics.length,
            0
        );

        const updatedMetricSet = {
            ...editedMetricSet,
            count: totalMetrics,
            updated: 'Just now',
        };

        onSave(updatedMetricSet);
        onOpenChange(false);
    };

    if (!editedMetricSet) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {metricSet ? 'Edit Metric Set' : 'Create Metric Set'}
                    </DialogTitle>
                    <DialogDescription>
                        Configure custom layers and metrics for evaluation. Each metric requires a name, type, and judging prompt.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Metric Set Name */}
                    <div className="space-y-2">
                        <Label htmlFor="metric-set-name">Metric Set Name</Label>
                        <Input
                            id="metric-set-name"
                            value={editedMetricSet.name}
                            onChange={(e) =>
                                setEditedMetricSet({ ...editedMetricSet, name: e.target.value })
                            }
                            placeholder="Enter metric set name"
                        />
                    </div>

                    {/* Layers Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Layers</h3>
                                <Badge variant="secondary">{editedMetricSet.layers.length}</Badge>
                            </div>
                            <Button onClick={addLayer} size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Layer
                            </Button>
                        </div>

                        {editedMetricSet.layers.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                    <Layers className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground">
                                        No layers yet. Add a layer to start configuring metrics.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {editedMetricSet.layers.map((layer) => (
                                    <Card key={layer.id} className="border-primary/20">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <button
                                                        onClick={() => toggleLayer(layer.id)}
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {expandedLayers.has(layer.id) ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                    <Input
                                                        value={layer.name}
                                                        onChange={(e) =>
                                                            updateLayerName(layer.id, e.target.value)
                                                        }
                                                        className="font-medium"
                                                        placeholder="Layer name"
                                                    />
                                                    <Badge variant="outline">
                                                        {layer.metrics.length} metrics
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteLayer(layer.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        {expandedLayers.has(layer.id) && (
                                            <CardContent className="space-y-4">
                                                {/* Metrics in this layer */}
                                                {layer.metrics.map((metric) => (
                                                    <Card key={metric.id} className="bg-muted/30">
                                                        <CardContent className="pt-4 space-y-4">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 space-y-4">
                                                                    {/* Metric Name */}
                                                                    <div className="space-y-2">
                                                                        <Label>Metric Name</Label>
                                                                        <Input
                                                                            value={metric.name}
                                                                            onChange={(e) =>
                                                                                updateMetric(layer.id, metric.id, {
                                                                                    name: e.target.value,
                                                                                })
                                                                            }
                                                                            placeholder="Enter metric name"
                                                                        />
                                                                    </div>

                                                                    {/* Metric Type */}
                                                                    <div className="space-y-2">
                                                                        <Label>Metric Type</Label>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                                            {(['LLM-as-Judge', 'Comparison', 'Algo'] as const).map((type) => (
                                                                                <button
                                                                                    key={type}
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleMetricTypeChange(
                                                                                            layer.id,
                                                                                            metric.id,
                                                                                            type
                                                                                        )
                                                                                    }
                                                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${metric.type === type
                                                                                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                                                                            : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                                                                        }`}
                                                                                >
                                                                                    {type}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {/* Default Template */}
                                                                    <div className="space-y-2">
                                                                        <Label>Load Default Template (Optional)</Label>
                                                                        <Select
                                                                            onChange={(e) => {
                                                                                if (e.target.value) {
                                                                                    applyDefaultTemplate(
                                                                                        layer.id,
                                                                                        metric.id,
                                                                                        e.target.value
                                                                                    );
                                                                                }
                                                                            }}
                                                                            value=""
                                                                        >
                                                                            <option value="">
                                                                                Select a template...
                                                                            </option>
                                                                            {DEFAULT_METRIC_TEMPLATES.map((template) => (
                                                                                <option
                                                                                    key={template.name}
                                                                                    value={template.name}
                                                                                >
                                                                                    {template.name} ({template.type})
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>

                                                                    {/* Judging Prompt */}
                                                                    <div className="space-y-2">
                                                                        <Label>Judging Prompt</Label>
                                                                        <Textarea
                                                                            value={metric.judgingPrompt}
                                                                            onChange={(e) =>
                                                                                updateMetric(layer.id, metric.id, {
                                                                                    judgingPrompt: e.target.value,
                                                                                })
                                                                            }
                                                                            placeholder="Enter judging prompt"
                                                                            className="min-h-[150px] font-mono text-xs"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        deleteMetric(layer.id, metric.id)
                                                                    }
                                                                    className="text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}

                                                {/* Add Metric Button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addMetric(layer.id)}
                                                    className="w-full border-dashed"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Metric to {layer.name}
                                                </Button>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Save Metric Set
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
