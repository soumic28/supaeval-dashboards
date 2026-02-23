import { useState, useRef, useEffect } from 'react';
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
import { BarChart2, Plus, Trash2, AlertCircle, MoreVertical, Edit2, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditMetricSetDialog } from '@/components/configurations/EditMetricSetDialog';
import type { MetricSet } from '@/types/MetricTypes';
import { DEFAULT_LAYER_TEMPLATES } from '@/config/defaultMetrics';

export default function MetricsConfigPage() {
    const [metricSets, setMetricSets] = useState<MetricSet[]>([
        {
            id: 1,
            name: "RAG Evaluation",
            count: 5,
            type: "Accuracy",
            updated: "1 day ago",
            layers: [
                {
                    id: 'layer-rag-1',
                    name: DEFAULT_LAYER_TEMPLATES[0].name,
                    metrics: DEFAULT_LAYER_TEMPLATES[0].metrics.map((m, idx) => ({
                        id: `metric-rag-${idx}`,
                        name: m.name,
                        type: m.type,
                        judgingPrompt: m.judgingPrompt,
                    })),
                },
            ],
        },
        {
            id: 2,
            name: "Chat Quality",
            count: 3,
            type: "Human Preference",
            updated: "3 days ago",
            layers: [
                {
                    id: 'layer-chat-1',
                    name: DEFAULT_LAYER_TEMPLATES[1].name,
                    metrics: DEFAULT_LAYER_TEMPLATES[1].metrics.map((m, idx) => ({
                        id: `metric-chat-${idx}`,
                        name: m.name,
                        type: m.type,
                        judgingPrompt: m.judgingPrompt,
                    })),
                },
            ],
        },
        {
            id: 3,
            name: "Code Safety",
            count: 4,
            type: "Security",
            updated: "1 week ago",
            layers: [
                {
                    id: 'layer-code-1',
                    name: DEFAULT_LAYER_TEMPLATES[2].name,
                    metrics: DEFAULT_LAYER_TEMPLATES[2].metrics.map((m, idx) => ({
                        id: `metric-code-${idx}`,
                        name: m.name,
                        type: m.type,
                        judgingPrompt: m.judgingPrompt,
                    })),
                },
            ],
        },
    ]);

    const [selectedMetricSet, setSelectedMetricSet] = useState<MetricSet | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [metricSetToDelete, setMetricSetToDelete] = useState<MetricSet | null>(null);

    const handleEditMetricSet = (metricSet: MetricSet) => {
        setSelectedMetricSet(metricSet);
        setIsDialogOpen(true);
    };

    const handleCreateMetricSet = () => {
        setSelectedMetricSet(null);
        setIsDialogOpen(true);
    };

    const handleSaveMetricSet = (updatedMetricSet: MetricSet) => {
        setMetricSets((prev) => {
            const existingIndex = prev.findIndex((ms) => ms.id === updatedMetricSet.id);
            if (existingIndex >= 0) {
                // Update existing
                const newSets = [...prev];
                newSets[existingIndex] = updatedMetricSet;
                return newSets;
            } else {
                // Add new
                return [...prev, updatedMetricSet];
            }
        });
    };

    const handleDeleteClick = (metricSet: MetricSet, e: React.MouseEvent) => {
        e.stopPropagation();
        setMetricSetToDelete(metricSet);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (metricSetToDelete) {
            setMetricSets((prev) => prev.filter((ms) => ms.id !== metricSetToDelete.id));
            setDeleteDialogOpen(false);
            setMetricSetToDelete(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Metrics Configuration</h1>
                    <p className="text-muted-foreground">Configure metrics for mapping agents.</p>
                </div>
                <Button className="w-full md:w-auto" onClick={handleCreateMetricSet}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Metric Set
                </Button>
            </div>

            {/* Metric Sets Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {metricSets.map((set, index) => (
                        <motion.div
                            key={set.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            layout
                        >
                            <Card className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="flex-1" onClick={() => handleEditMetricSet(set)}>
                                        <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                            {set.name}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1 relative" ref={openMenuId === set.id ? menuRef : null}>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === set.id ? null : set.id);
                                            }}
                                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                        >
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </motion.button>

                                        <AnimatePresence>
                                            {openMenuId === set.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-8 z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none"
                                                >
                                                    <div className="flex flex-col">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditMetricSet(set);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // TODO: Add test user logic
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        >
                                                            <UserPlus className="mr-2 h-4 w-4" />
                                                            <span>Add test user</span>
                                                        </button>
                                                        <div className="h-px bg-border my-1 mx-1" />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(set, e);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 text-destructive focus:bg-destructive focus:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardHeader>
                                <CardContent onClick={() => handleEditMetricSet(set)}>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <BarChart2 className="h-3 w-3" />
                                        <span>{set.type}</span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <Badge variant="secondary" className="text-xs">
                                            {set.count} Metrics
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Updated {set.updated}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Create New Metric Set Card */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: metricSets.length * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-6 hover:bg-accent/50 hover:border-primary/50 transition-all h-full min-h-[200px]"
                    onClick={handleCreateMetricSet}
                >
                    <div className="rounded-full bg-background p-3 mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Create New Metric Set</span>
                </motion.button>
            </div>

            {/* Edit Metric Set Dialog */}
            <EditMetricSetDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                metricSet={selectedMetricSet}
                onSave={handleSaveMetricSet}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Delete Metric Set
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground">
                                {metricSetToDelete?.name}
                            </span>
                            ? This will remove all {metricSetToDelete?.count} metrics and layers. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Metric Set
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
