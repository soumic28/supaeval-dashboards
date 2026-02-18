import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { useNavigate } from 'react-router-dom';
import { Play, Loader2, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';

interface NewRunModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewRunModal({ open, onOpenChange }: NewRunModalProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');

    // Data for dropdowns
    const [agents, setAgents] = useState<any[]>([]);
    const [datasets, setDatasets] = useState<any[]>([]);
    const [configs, setConfigs] = useState<any[]>([]);
    const [isFetchingOptions, setIsFetchingOptions] = useState(false);

    // Form State
    const [selectedAgent, setSelectedAgent] = useState("");
    const [selectedConfig, setSelectedConfig] = useState("");
    const [selectedDataset, setSelectedDataset] = useState("");
    const [selectedPersona, setSelectedPersona] = useState("confused-user");
    const [additionalContext, setAdditionalContext] = useState("");

    // Fetch Options on Open
    useEffect(() => {
        if (open) {
            const fetchOptions = async () => {
                setIsFetchingOptions(true);
                try {
                    const { agentService } = await import("@/services/agents");
                    const { datasetService } = await import("@/services/datasets");
                    const { evalConfigService } = await import("@/services/eval-configs");

                    const [agentsData, datasetsData, configsData] = await Promise.all([
                        agentService.getAll().catch(() => []),
                        datasetService.getAll().catch(() => []),
                        evalConfigService.getAll().catch(() => [])
                    ]);

                    setAgents(agentsData || []);
                    setDatasets(datasetsData || []);
                    setConfigs(configsData || []);

                    // Set defaults if available
                    if (agentsData && agentsData.length > 0) setSelectedAgent(agentsData[0].id);

                    if (datasetsData && datasetsData.length > 0) setSelectedDataset(datasetsData[0].id);

                    if (configsData && configsData.length > 0) setSelectedConfig(configsData[0].id);

                } catch (error) {
                    console.error("Failed to fetch run options", error);
                } finally {
                    setIsFetchingOptions(false);
                }
            };
            fetchOptions();
        }
    }, [open]);

    const handleStartRun = async () => {
        if (!selectedAgent || !selectedDataset || !selectedConfig) {
            alert("Please select an Agent, Dataset, and Configuration to start a run.");
            return;
        }

        setIsLoading(true);
        try {
            const { runService } = await import("@/services/runs");

            // Construct Payload
            const payload: any = {
                agent_id: selectedAgent,
                dataset_id: selectedDataset,
                eval_profile_id: selectedConfig,
                input_data: {
                    persona: selectedPersona,
                    additional_context: additionalContext,
                    scheduled_at: isScheduled ? scheduledDate : null
                }
            };

            console.log("Creating Run Payload:", payload);

            await runService.create(payload);

            console.log('Run started successfully via API');
            onOpenChange(false);
            navigate('/evaluations/run-details', { state: { runId: "new" } });
        } catch (error) {
            console.error("Failed to create run", error);
            alert("Failed to start run. Please check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Start New Evaluation Run</DialogTitle>
                    <DialogDescription>
                        Configure the parameters for your new agent evaluation.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {isFetchingOptions ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Agent</Label>
                                    <Select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                                        {agents.length > 0 ? (
                                            agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)
                                        ) : (
                                            <option value="" disabled>No Agents Found (Create one first)</option>
                                        )}
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Configuration</Label>
                                    <Select value={selectedConfig} onChange={(e) => setSelectedConfig(e.target.value)}>
                                        {configs.length > 0 ? (
                                            configs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                        ) : (
                                            <option value="" disabled>No Configs Found</option>
                                        )}
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Dataset</Label>
                                    <Select value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)}>
                                        {datasets.length > 0 ? (
                                            datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                                        ) : (
                                            <option value="" disabled>No Datasets Found</option>
                                        )}
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>User Persona</Label>
                                    <Select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)}>
                                        <option value="confused-user">Confused User</option>
                                        <option value="angry-customer">Angry Customer</option>
                                        <option value="technical-expert">Technical Expert</option>
                                        <option value="random-visitor">Random Visitor</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Additional Context</Label>
                                <Textarea
                                    placeholder="Enter any specific context, system prompts overrides, or constraints for this run..."
                                    className="min-h-[100px]"
                                    value={additionalContext}
                                    onChange={(e) => setAdditionalContext(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Schedule for later</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Automatically start this run at a specific date and time
                                    </div>
                                </div>
                                <Switch
                                    checked={isScheduled}
                                    onCheckedChange={setIsScheduled}
                                />
                            </div>

                            {isScheduled && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label>Scheduled Date & Time</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="datetime-local"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStartRun}
                        disabled={isLoading || (isScheduled && !scheduledDate) || !selectedAgent || !selectedDataset || !selectedConfig}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isScheduled ? 'Scheduling...' : 'Starting...'}
                            </>
                        ) : (
                            <>
                                {isScheduled ? <Calendar className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {isScheduled ? 'Schedule Run' : 'Start Run'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
