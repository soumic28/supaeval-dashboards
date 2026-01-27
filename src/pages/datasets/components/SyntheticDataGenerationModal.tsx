import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Shield, Database, Settings, BarChart, FileText, Layers, ChevronRight, ChevronLeft } from 'lucide-react';

interface SyntheticDataGenerationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const STEPS = ['setup', 'behavior', 'context', 'safety', 'output', 'advanced', 'metadata'];

export function SyntheticDataGenerationModal({ open, onOpenChange }: SyntheticDataGenerationModalProps) {
    const [activeTab, setActiveTab] = useState("setup");

    // Form State
    const [formData, setFormData] = useState({
        // 1. Setup
        agentType: "RAG",
        useCase: "Customer Support",
        promptCount: 500,
        complexityLevel: ["L2", "L3"],
        domain: "Finance",

        // 2. Behavior
        reasoningDepth: 4,
        taskType: ["Factual", "Planning"],
        multiStepPercent: 60,
        ambiguityLevel: 3, // 1-5
        longHorizonTasks: true,

        // 3. Context / Tools
        contextSource: "PDF",
        docsPerPrompt: [2, 5],
        contextLength: 4000,
        noiseInjection: 20,
        conflictInjection: true,
        toolCount: 3,
        toolTypes: ["Search", "DB"],
        toolErrorRate: 10,
        toolLatency: 300,
        retryAllowed: true,

        // 4. Safety
        adversarialPercent: 5,
        biasProbes: true,
        hallucinationTraps: true,
        policySensitivity: "Medium",

        // 5. Output & Metrics
        outputFormat: "JSON",
        strictFormatting: true,
        groundTruthType: "Synthetic",
        autoScoring: true,
        metricsBundle: ["EM", "F1"],

        // 6. Advanced
        duplicateRate: 2,
        paraphraseVariance: 80, // High
        difficultyCurve: "Linear",
        topicCoverage: 80,
        languageMix: ["EN"],

        // 7. Metadata
        datasetName: "RAG_Fin_v1",
        versionTag: "v1.2",
        owner: "afeefa",
        expiryDate: "90 days",
        complianceTags: ["SOC2"]
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Submitting Generation Job:", formData);
        onOpenChange(false);
    };

    const currentStepIndex = STEPS.indexOf(activeTab);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const handleNext = () => {
        if (!isLastStep) {
            setActiveTab(STEPS[currentStepIndex + 1]);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setActiveTab(STEPS[currentStepIndex - 1]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        New Synthetic Data Job
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} className="w-full mt-4">
                    <TabsList className="grid grid-cols-7 w-full h-auto p-1 bg-muted/50 pointer-events-none">
                        <TabsTrigger value="setup" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Settings className="w-4 h-4" /> Setup
                        </TabsTrigger>
                        <TabsTrigger value="behavior" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Layers className="w-4 h-4" /> Behavior
                        </TabsTrigger>
                        <TabsTrigger value="context" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            {formData.agentType === 'RAG' ? <Database className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                            {formData.agentType === 'RAG' ? 'Context' : 'Tools'}
                        </TabsTrigger>
                        <TabsTrigger value="safety" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Shield className="w-4 h-4" /> Safety
                        </TabsTrigger>
                        <TabsTrigger value="output" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <BarChart className="w-4 h-4" /> Output
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Settings className="w-4 h-4" /> Advanced
                        </TabsTrigger>
                        <TabsTrigger value="metadata" className="text-xs py-2 flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <FileText className="w-4 h-4" /> Metadata
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-6 min-h-[400px]">
                        {/* Tab 1: Setup */}
                        <TabsContent value="setup" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Agent Type</Label>
                                    <Select value={formData.agentType} onChange={(e) => handleInputChange('agentType', e.target.value)}>
                                        <option value="" disabled>Select type</option>
                                        <option value="RAG">RAG Agent</option>
                                        <option value="Tool">Tool Use Agent</option>
                                        <option value="Planner">Planner Agent</option>
                                        <option value="Chat">Chat Agent</option>
                                        <option value="Coder">Coder Agent</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Domain</Label>
                                    <Select value={formData.domain} onChange={(e) => handleInputChange('domain', e.target.value)}>
                                        <option value="" disabled>Select domain</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Health">Healthcare</option>
                                        <option value="Legal">Legal</option>
                                        <option value="Tech">Technology</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Use Case</Label>
                                    <Input value={formData.useCase} onChange={(e) => handleInputChange('useCase', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Prompt Count</Label>
                                    <Input type="number" value={formData.promptCount} onChange={(e) => handleInputChange('promptCount', parseInt(e.target.value))} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Complexity Level</Label>
                                    <div className="flex gap-2">
                                        {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'].map((level) => (
                                            <Badge
                                                key={level}
                                                variant={formData.complexityLevel.includes(level) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    const current = formData.complexityLevel;
                                                    const updated = current.includes(level)
                                                        ? current.filter(l => l !== level)
                                                        : [...current, level];
                                                    handleInputChange('complexityLevel', updated);
                                                }}
                                            >
                                                {level}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab 2: Behavior */}
                        <TabsContent value="behavior" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Reasoning Depth (Steps)</Label>
                                        <span className="text-sm text-muted-foreground">{formData.reasoningDepth}</span>
                                    </div>
                                    <Slider
                                        value={[formData.reasoningDepth]}
                                        max={10}
                                        step={1}
                                        onValueChange={(v) => handleInputChange('reasoningDepth', v[0])}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Multi-Step Reasoning %</Label>
                                        <span className="text-sm text-muted-foreground">{formData.multiStepPercent}%</span>
                                    </div>
                                    <Slider
                                        value={[formData.multiStepPercent]}
                                        max={100}
                                        step={5}
                                        onValueChange={(v) => handleInputChange('multiStepPercent', v[0])}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Ambiguity Level</Label>
                                        <span className="text-sm text-muted-foreground">{formData.ambiguityLevel}/5</span>
                                    </div>
                                    <Slider
                                        value={[formData.ambiguityLevel]}
                                        max={5}
                                        step={1}
                                        onValueChange={(v) => handleInputChange('ambiguityLevel', v[0])}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Long-Horizon Tasks</Label>
                                        <p className="text-sm text-muted-foreground">Enable complex workflows requiring memory</p>
                                    </div>
                                    <Switch
                                        checked={formData.longHorizonTasks}
                                        onCheckedChange={(v) => handleInputChange('longHorizonTasks', v)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab 3: Context / Tools (Dynamic) */}
                        <TabsContent value="context" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            {formData.agentType === 'RAG' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Context Source</Label>
                                            <Select value={formData.contextSource} onChange={(e) => handleInputChange('contextSource', e.target.value)}>
                                                <option value="PDF">PDF Documents</option>
                                                <option value="KB">Knowledge Base</option>
                                                <option value="Web">Web Search</option>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Context Length (Tokens)</Label>
                                            <Input type="number" value={formData.contextLength} onChange={(e) => handleInputChange('contextLength', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Label>Noise Injection %</Label>
                                            <span className="text-sm text-muted-foreground">{formData.noiseInjection}%</span>
                                        </div>
                                        <Slider
                                            value={[formData.noiseInjection]}
                                            max={100}
                                            onValueChange={(v) => handleInputChange('noiseInjection', v[0])}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Conflict Injection</Label>
                                            <p className="text-sm text-muted-foreground">Intentionally contradict information to test robustness</p>
                                        </div>
                                        <Switch
                                            checked={formData.conflictInjection}
                                            onCheckedChange={(v) => handleInputChange('conflictInjection', v)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Tool Count</Label>
                                            <Input type="number" value={formData.toolCount} onChange={(e) => handleInputChange('toolCount', parseInt(e.target.value))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tool Latency (ms)</Label>
                                            <Input type="number" value={formData.toolLatency} onChange={(e) => handleInputChange('toolLatency', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Label>Tool Error Rate %</Label>
                                            <span className="text-sm text-muted-foreground">{formData.toolErrorRate}%</span>
                                        </div>
                                        <Slider
                                            value={[formData.toolErrorRate]}
                                            max={100}
                                            onValueChange={(v) => handleInputChange('toolErrorRate', v[0])}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Retry Allowed</Label>
                                            <p className="text-sm text-muted-foreground">Allow agent to retry failed tool calls</p>
                                        </div>
                                        <Switch
                                            checked={formData.retryAllowed}
                                            onCheckedChange={(v) => handleInputChange('retryAllowed', v)}
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Tab 4: Safety */}
                        <TabsContent value="safety" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Adversarial Attack %</Label>
                                        <span className="text-sm text-muted-foreground">{formData.adversarialPercent}%</span>
                                    </div>
                                    <Slider
                                        value={[formData.adversarialPercent]}
                                        max={100}
                                        onValueChange={(v) => handleInputChange('adversarialPercent', v[0])}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Bias Probes</Label>
                                        <p className="text-sm text-muted-foreground">Test for gender, racial, and political bias</p>
                                    </div>
                                    <Switch
                                        checked={formData.biasProbes}
                                        onCheckedChange={(v) => handleInputChange('biasProbes', v)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Hallucination Traps</Label>
                                        <p className="text-sm text-muted-foreground">Inject fake facts to test grounding</p>
                                    </div>
                                    <Switch
                                        checked={formData.hallucinationTraps}
                                        onCheckedChange={(v) => handleInputChange('hallucinationTraps', v)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Policy Sensitivity</Label>
                                    <Select value={formData.policySensitivity} onChange={(e) => handleInputChange('policySensitivity', e.target.value)}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Strict">Strict</option>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab 5: Output & Metrics */}
                        <TabsContent value="output" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Output Format</Label>
                                    <Select value={formData.outputFormat} onChange={(e) => handleInputChange('outputFormat', e.target.value)}>
                                        <option value="JSON">JSON</option>
                                        <option value="Table">Table</option>
                                        <option value="Text">Text</option>
                                        <option value="Code">Code</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ground Truth Type</Label>
                                    <Select value={formData.groundTruthType} onChange={(e) => handleInputChange('groundTruthType', e.target.value)}>
                                        <option value="Human">Human Labeled</option>
                                        <option value="Synthetic">Synthetic (Model)</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Strict Formatting</Label>
                                    <p className="text-sm text-muted-foreground">Enforce strict schema validation</p>
                                </div>
                                <Switch
                                    checked={formData.strictFormatting}
                                    onCheckedChange={(v) => handleInputChange('strictFormatting', v)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto-Scoring</Label>
                                    <p className="text-sm text-muted-foreground">Automatically calculate metrics</p>
                                </div>
                                <Switch
                                    checked={formData.autoScoring}
                                    onCheckedChange={(v) => handleInputChange('autoScoring', v)}
                                />
                            </div>
                        </TabsContent>

                        {/* Tab 6: Advanced */}
                        <TabsContent value="advanced" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Duplicate Rate %</Label>
                                    <span className="text-sm text-muted-foreground">{formData.duplicateRate}%</span>
                                </div>
                                <Slider
                                    value={[formData.duplicateRate]}
                                    max={20}
                                    onValueChange={(v) => handleInputChange('duplicateRate', v[0])}
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Paraphrase Variance</Label>
                                    <span className="text-sm text-muted-foreground">{formData.paraphraseVariance}%</span>
                                </div>
                                <Slider
                                    value={[formData.paraphraseVariance]}
                                    max={100}
                                    onValueChange={(v) => handleInputChange('paraphraseVariance', v[0])}
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Topic Coverage %</Label>
                                    <span className="text-sm text-muted-foreground">{formData.topicCoverage}%</span>
                                </div>
                                <Slider
                                    value={[formData.topicCoverage]}
                                    max={100}
                                    onValueChange={(v) => handleInputChange('topicCoverage', v[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty Curve</Label>
                                <Select value={formData.difficultyCurve} onChange={(e) => handleInputChange('difficultyCurve', e.target.value)}>
                                    <option value="Linear">Linear</option>
                                    <option value="Exponential">Exponential</option>
                                    <option value="Random">Random</option>
                                </Select>
                            </div>
                        </TabsContent>

                        {/* Tab 7: Metadata */}
                        <TabsContent value="metadata" className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Dataset Name</Label>
                                    <Input value={formData.datasetName} onChange={(e) => handleInputChange('datasetName', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Version Tag</Label>
                                    <Input value={formData.versionTag} onChange={(e) => handleInputChange('versionTag', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Owner</Label>
                                    <Input value={formData.owner} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Expiry / Refresh</Label>
                                    <Input value={formData.expiryDate} onChange={(e) => handleInputChange('expiryDate', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Compliance Tags</Label>
                                <div className="flex gap-2">
                                    {['SOC2', 'GDPR', 'HIPAA', 'CCPA'].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant={formData.complianceTags.includes(tag) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                const current = formData.complianceTags;
                                                const updated = current.includes(tag)
                                                    ? current.filter(t => t !== tag)
                                                    : [...current, tag];
                                                handleInputChange('complianceTags', updated);
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter className="mt-6 border-t pt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <Button variant="outline" onClick={handleBack}>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {!isLastStep ? (
                            <Button onClick={handleNext}>
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Job
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
