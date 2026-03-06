import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, ChevronRight, Copy, Activity,
    Check, Code2, Sparkles, Plus, Trash2,
    Key, LayoutDashboard, FileCode2, Package, AlertTriangle, CheckSquare, Bot,
    Database, Wrench, Users, Plug
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { metricPacksService } from '@/services/metricPacks';
import { agentService } from '@/services/agents';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';

import type { AgentEndpoint } from '@/types/AgentTypes';

export function GetStarted() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [tracesCount, setTracesCount] = useState(0);
    const [selectedPacks, setSelectedPacks] = useState<string[]>(['hallucination']);

    // New Agent State
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');
    const [agentCategory, setAgentCategory] = useState<'Development' | 'Staging' | 'Production'>('Development');
    const [parallelRuns, setParallelRuns] = useState<number | undefined>(undefined);
    const [endpoints, setEndpoints] = useState<AgentEndpoint[]>([]);
    const [auth, setAuth] = useState<{ type: 'none' | 'client_credentials', clientId?: string, clientSecret?: string }>({ type: 'none' });
    const [isCreating, setIsCreating] = useState(false);
    const [isProvisioned, setIsProvisioned] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

    const AGENT_TEMPLATES = [
        {
            id: 'rag',
            title: 'RAG',
            icon: Database,
            desc: 'Retrieval-Augmented Generation agent for...',
            defaultName: 'My RAG Agent',
            defaultDesc: 'A RAG-based agent for knowledge retrieval.',
            scope: 'rag'
        },
        {
            id: 'rag-tools',
            title: 'RAG + Tools',
            icon: Wrench,
            desc: 'RAG agent enhanced with external tool...',
            defaultName: 'Smart Tool Agent',
            defaultDesc: 'Agent with RAG and function calling capabilities.',
            scope: 'rag'
        },
        {
            id: 'single',
            title: 'Single Agent',
            icon: Bot,
            desc: 'A standalone agent for specific tasks without...',
            defaultName: 'Task Assistant',
            defaultDesc: 'A focused single-purpose agent.',
            scope: 'agent'
        },
        {
            id: 'multi',
            title: 'Multi Agent',
            icon: Users,
            desc: 'Orchestrator for a multi-agent system...',
            defaultName: 'Agent Swarm',
            defaultDesc: 'Complex orchestrator for multiple sub-agents.',
            scope: 'agent'
        },
        {
            id: 'custom',
            title: 'Custom Adapter',
            icon: Plug,
            desc: 'Connect your own custom agent...',
            defaultName: 'Custom Integration',
            defaultDesc: 'A custom agent integration via adapter.',
            scope: 'agent'
        }
    ];

    const handleSelectTemplate = (template: typeof AGENT_TEMPLATES[0]) => {
        setSelectedTemplate(template.id);
        setAgentName(template.defaultName);
        setAgentDescription(template.defaultDesc);
    };

    const handleCreateAgentFromStep1 = async () => {
        if (!agentName) return;

        setIsCreating(true);
        try {
            if (createdAgentId) {
                // If we already have an agent, update it instead of creating a new one
                await agentService.update(createdAgentId, {
                    name: agentName,
                    description: agentDescription,
                    category: agentCategory,
                    status: "Active",
                    endpoints: endpoints,
                    auth: auth,
                    parallelRuns: parallelRuns,
                });
            } else {
                // Create new agent
                const agent = await agentService.create({
                    name: agentName,
                    description: agentDescription,
                    category: agentCategory,
                    status: "Active",
                    endpoints: endpoints,
                    auth: auth,
                    parallelRuns: parallelRuns,
                    metrics: []
                });
                setCreatedAgentId(agent.id);
            }
            setStep(2);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: `Failed to ${createdAgentId ? 'update' : 'create'} agent.`, variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    const addEndpoint = () => {
        setEndpoints([...endpoints, { id: Date.now().toString(), method: 'POST' as const, url: '' }] as AgentEndpoint[]);
    };

    const removeEndpoint = (id: string) => {
        setEndpoints(endpoints.filter(ep => ep.id !== id));
    };

    const updateEndpoint = (id: string, field: 'method' | 'url', value: string) => {
        setEndpoints(endpoints.map(ep => ep.id === id ? { ...ep, [field]: value } : ep) as AgentEndpoint[]);
    };

    const steps = [
        { id: 1, label: "Welcome", icon: Sparkles },
        { id: 2, label: "API Key Created", icon: Key },
        { id: 3, label: "Live Capture", icon: Activity },
        { id: 4, label: "First Dashboard", icon: LayoutDashboard },
        { id: 5, label: "Adapter Review", icon: FileCode2 },
        { id: 6, label: "Activated", icon: CheckCircle2 },
        { id: 7, label: "Smart Metrics", icon: Package }
    ];

    useEffect(() => {
        if (step === 3) {
            setTracesCount(0);
            const interval = setInterval(() => {
                setTracesCount(prev => {
                    if (prev >= 6) {
                        clearInterval(interval);
                        return 6;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Code snippet copied to clipboard",
        });
    };

    const nextStep = () => setStep(step + 1);

    const togglePack = (packId: string) => {
        setSelectedPacks(prev =>
            prev.includes(packId)
                ? prev.filter(id => id !== packId)
                : [...prev, packId]
        );
    };

    const pythonSnippet = `from supaeval import track\n\n @track\ndef run_agent(input): \n    return agent.run(input)`;
    const curlSnippet = `curl -X POST https://api.supaeval.com/v1/traces \\\n  -H "Authorization: Bearer sk_live_..." \\\n  -H "X-Agent-ID: ${createdAgentId || 'agent_id_here'}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"input": "...", "output": "..."}'`;

    return (
        <div className="grid grid-cols-12 gap-12 mt-8">
            {/* Left Side - Steps Navigation */}
            <div className="col-span-3">
                <nav className="space-y-1 relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border -z-10" />
                    {steps.map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer relative",
                                step === s.id
                                    ? "bg-primary/5 text-primary"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => step > s.id && setStep(s.id)}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center bg-background transition-colors shadow-sm",
                                step === s.id ? "border-primary text-primary" :
                                    step > s.id ? "border-primary/20 bg-primary/5 text-primary/40" : "border-muted text-muted-foreground/30"
                            )}>
                                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                            </div>
                            <span>{s.label}</span>
                            {step === s.id && (
                                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right Side - Content */}
            <div className="col-span-9">
                <AnimatePresence mode="wait">
                    {/* Screen 1: Welcome */}
                    {step === 1 && (
                        <motion.div
                            key="s1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                    Start evaluating your AI Agent<br />
                                    in under 5 minutes
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    No layers. No schema setup. Just connect your agent and see real issues instantly.
                                </p>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-border">
                                {/* Select a Template Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                                        Select a Template
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                        {AGENT_TEMPLATES.map((template) => (
                                            <motion.button
                                                key={template.id}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSelectTemplate(template)}
                                                className={cn(
                                                    "flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all",
                                                    selectedTemplate === template.id
                                                        ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                                                        : "border-border bg-background hover:border-primary/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                                                    selectedTemplate === template.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                )}>
                                                    <template.icon className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xs font-bold leading-none">{template.title}</h3>
                                                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                                                        {template.desc}
                                                    </p>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                                            Agent Identity
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-name">Agent Name *</Label>
                                            <Input
                                                id="agent-name"
                                                value={agentName}
                                                onChange={(e) => setAgentName(e.target.value)}
                                                placeholder="E.g., Customer Support Bot"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Agent Category</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['Development', 'Staging', 'Production'] as const).map((category) => (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() => setAgentCategory(category)}
                                                        className={cn(
                                                            "px-3 py-2 rounded-lg text-xs font-medium transition-all border-2",
                                                            agentCategory === category
                                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                                                        )}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="agent-desc">Description</Label>
                                            <Textarea
                                                id="agent-desc"
                                                value={agentDescription}
                                                onChange={(e) => setAgentDescription(e.target.value)}
                                                placeholder="Describe what this agent does..."
                                                className="min-h-[80px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                                            Advanced Configuration
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowAdvanced(!showAdvanced)}
                                                className="h-6 text-[10px] font-bold"
                                            >
                                                {showAdvanced ? "Hide Details" : "Setup Connection"}
                                            </Button>
                                        </div>

                                        {showAdvanced ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <EnhancedTooltip content="Max parallel operations allowed for batch evals." title="Parallel Runs">
                                                        <Label htmlFor="parallel-runs">Parallel Runs</Label>
                                                    </EnhancedTooltip>
                                                    <Input
                                                        id="parallel-runs"
                                                        type="number"
                                                        value={parallelRuns || ''}
                                                        onChange={(e) => setParallelRuns(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                                                        placeholder="e.g., 5"
                                                        className="w-full h-9 text-xs"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Endpoints</Label>
                                                        <Button type="button" variant="outline" size="sm" onClick={addEndpoint} className="h-6 text-[10px]">
                                                            <Plus className="h-3 w-3 mr-1" /> Add
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                                                        {endpoints.map((endpoint) => (
                                                            <div key={endpoint.id} className="flex gap-2 items-start">
                                                                <Select
                                                                    value={endpoint.method}
                                                                    onChange={(e) => updateEndpoint(endpoint.id, 'method', e.target.value)}
                                                                    className="w-20 h-8 text-[10px] p-1 shadow-none focus:ring-1"
                                                                >
                                                                    <option value="POST">POST</option>
                                                                    <option value="GET">GET</option>
                                                                    <option value="PUT">PUT</option>
                                                                    <option value="DELETE">DEL</option>
                                                                </Select>
                                                                <Input
                                                                    value={endpoint.url}
                                                                    onChange={(e) => updateEndpoint(endpoint.id, 'url', e.target.value)}
                                                                    placeholder="/api/chat"
                                                                    className="flex-1 h-8 text-[10px]"
                                                                />
                                                                <Button variant="ghost" size="icon" onClick={() => removeEndpoint(endpoint.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Auth Type</Label>
                                                    <Select
                                                        value={auth.type}
                                                        onChange={(e) => setAuth({
                                                            type: e.target.value as 'none' | 'client_credentials',
                                                            clientId: e.target.value === 'client_credentials' ? (auth.clientId || '') : undefined,
                                                            clientSecret: e.target.value === 'client_credentials' ? (auth.clientSecret || '') : undefined
                                                        })}
                                                        className="w-full h-8 text-[10px] shadow-none focus:ring-1"
                                                    >
                                                        <option value="none">None</option>
                                                        <option value="client_credentials">Client Credentials</option>
                                                    </Select>

                                                    {auth.type === 'client_credentials' && (
                                                        <div className="grid grid-cols-1 gap-2 pt-1">
                                                            <Input
                                                                value={auth.clientId || ''}
                                                                onChange={(e) => setAuth({ ...auth, clientId: e.target.value })}
                                                                placeholder="Client ID"
                                                                className="h-8 text-[10px]"
                                                            />
                                                            <Input
                                                                type="password"
                                                                value={auth.clientSecret || ''}
                                                                onChange={(e) => setAuth({ ...auth, clientSecret: e.target.value })}
                                                                placeholder="Client Secret"
                                                                className="h-8 text-[10px]"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/20">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Code2 className="w-6 h-6 text-primary/40" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">Automatic Connection</p>
                                                    <p className="text-xs text-muted-foreground max-w-[200px]">We'll record samples from your agent hits automatically.</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowAdvanced(true)}
                                                    className="h-8 text-xs"
                                                >
                                                    Configure Manually
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    size="lg"
                                    onClick={handleCreateAgentFromStep1}
                                    disabled={!agentName || isCreating}
                                    className="h-12 px-8 text-base shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700 text-white border-none disabled:opacity-50"
                                >
                                    {isCreating ? 'Creating...' : 'Create API Key'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8 text-base"
                                    onClick={() => window.open('https://www.supaeval.com/docs', '_blank')}
                                >
                                    View Docs
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Screen 2: API Key Created */}
                    {step === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">You’re ready to connect SupaEval</h1>
                                <p className="text-muted-foreground">Copy this snippet into your app:</p>
                            </div>

                            <Card className="bg-zinc-950 border-zinc-900 shadow-xl relative group">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-2 text-zinc-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(pythonSnippet)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <CardContent className="p-6">
                                    <pre className="font-mono text-sm text-emerald-400 leading-relaxed">
                                        <code>{pythonSnippet}</code>
                                    </pre>
                                </CardContent>
                            </Card>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Or use API mode if you don’t want SDK.</p>
                                <Card className="bg-zinc-950 border-zinc-900 relative group">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-2 text-zinc-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => copyToClipboard(curlSnippet)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <CardContent className="p-4">
                                        <pre className="font-mono text-xs text-blue-400 leading-relaxed overflow-x-auto">
                                            <code>{curlSnippet}</code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-muted/50 p-6 rounded-xl space-y-4">
                                <h3 className="font-medium">What happens next?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> We capture raw inputs & outputs
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> We auto-detect your agent structure
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> You’ll see your first evaluation in minutes
                                    </li>
                                </ul>
                            </div>

                            <Button onClick={nextStep} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                                I’ve added this to my app
                            </Button>
                        </motion.div>
                    )}

                    {/* Screen 3: Live Capture Screen */}
                    {step === 3 && (
                        <motion.div
                            key="s3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">We’re learning how your agent schema works…</h1>
                                <div className="space-y-2 text-muted-foreground mt-4">
                                    <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary shrink-0" /> Option 1: Run your app normally. We’ll observe a few real requests to understand your payload format.</p>
                                    <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary shrink-0" /> Option 2: Upload the json schema</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-8 space-y-6">
                                    <Card>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between font-medium">
                                                <span>Live Capture Progress</span>
                                                <span className="text-primary">{tracesCount} / 10 traces collected</span>
                                            </div>
                                            <Progress value={(tracesCount / 10) * 100} className="h-3 bg-secondary/30 text-primary" />

                                            <div className="bg-muted p-4 rounded-lg mt-6">
                                                <h4 className="text-sm font-semibold mb-2">Why we need this:</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    To generate a one-time adapter that maps your custom payload to SupaEval’s evaluation schema.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="col-span-4">
                                    <Card className="h-full border-dashed bg-muted/30">
                                        <CardContent className="p-6 space-y-4 flex flex-col justify-center h-full">
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mapping Quality</div>
                                            <div className="text-3xl font-bold text-amber-500">
                                                Low <span className="text-lg font-medium opacity-80">(0.32)</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                We’re using heuristic extraction for now.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Button
                                onClick={nextStep}
                                size="lg"
                                disabled={tracesCount < 5}
                                className="w-full sm:w-auto"
                            >
                                Generate Adapter (Need at least 5 traces)
                            </Button>
                        </motion.div>
                    )}

                    {/* Screen 4: First Dashboard */}
                    {step === 4 && (
                        <motion.div
                            key="s4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-4xl"
                        >
                            <div>
                                <Badge variant="secondary" className="mb-4">Immediate Value (Even before adapter)</Badge>
                                <h1 className="text-3xl font-bold tracking-tight">Here’s what we’re seeing so far</h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-rose-200 bg-rose-50/30">
                                    <CardContent className="p-6">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-rose-800">High Hallucination Risk</div>
                                            <div className="text-3xl font-bold text-rose-600">42%</div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-amber-200 bg-amber-50/30">
                                    <CardContent className="p-6">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-amber-800">Tool Failures</div>
                                            <div className="text-3xl font-bold text-amber-600">Detected</div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-emerald-200 bg-emerald-50/30">
                                    <CardContent className="p-6">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-emerald-800">Average Latency</div>
                                            <div className="text-3xl font-bold text-emerald-600">812ms</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 w-fit">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                                <div>
                                    <p className="font-medium text-sm">Mapping confidence is low — results may be incomplete.</p>
                                </div>
                            </div>

                            <Button onClick={nextStep} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                                Improve Mapping Accuracy
                            </Button>
                        </motion.div>
                    )}

                    {/* Screen 5 (User's Screen 6 Image): Adapter Review */}
                    {step === 5 && (
                        <motion.div
                            key="s5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-8 max-w-5xl"
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold tracking-tight mb-3">Schema Output</h1>
                                <p className="text-muted-foreground text-lg">We've auto-mapped your agent's unique cognitive structure.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Side */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        RAW SIGNAL INPUT
                                    </div>
                                    <Card className="border-border shadow-sm min-h-[300px]">
                                        <CardContent className="p-6 font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre">
                                            {`{
  "trace_id": "tr_89234",
  "timestamp": "2024-03-12T10:00:00Z",
  "kwargs": {
    "query": "How do I reset my password?",
    "user_id": "u_123"
  }
  ...
}`}
                                        </CardContent>
                                    </Card>

                                    {/* Logic Assumptions */}
                                    <div className="mt-8 pt-4">
                                        <div className="flex items-center gap-2 text-primary font-medium mb-4 text-sm">
                                            <Code2 className="w-4 h-4" />
                                            Logic Assumptions
                                        </div>
                                        <ul className="space-y-3 text-sm text-muted-foreground list-none pl-1">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" /> input comes from kwargs["query"]</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" /> output comes from result["answer"]</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" /> citations represent retrieval docs</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        TRANSLATION MATRIX
                                    </div>
                                    <Card className="bg-[#1e1e1e] border-none shadow-xl text-emerald-400 font-mono text-sm min-h-[300px]">
                                        <CardContent className="p-6 flex flex-col h-full justify-between">
                                            <pre className="whitespace-pre">
                                                {`def mapper(args, kwargs, result):
    return {
        "input_text": kwargs.get("query"),
        "output_text": result.get("answer"),
        "documents": result.get("citations"),
    }`}
                                            </pre>

                                            <div className="flex items-center justify-between text-xs mt-12 pt-4 border-t border-emerald-500/20">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    MAPPING_CONFIDENCE_SCORE: 0.89
                                                </div>
                                                <span className="opacity-50 font-medium">LN: 12 COL: 40</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t mt-8">
                                <Button onClick={nextStep} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 px-8">
                                    Activate Adapter
                                </Button>
                                <Button variant="outline" size="lg">
                                    ✏️ Edit Mapper
                                </Button>
                                <Button variant="outline" size="lg">
                                    🔁 Collect More Samples
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Screen 6 (User's Screen 7): Activated State */}
                    {step === 6 && (
                        <motion.div
                            key="s6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div className="p-8 bg-green-50 rounded-2xl border border-green-200 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-green-900">Adapter Activated for Workspace</h1>
                                <p className="text-green-800/80">All future traces will use this deterministic mapping.</p>
                            </div>

                            <Card className="shadow-sm">
                                <CardContent className="p-8">
                                    <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider mb-6">Dashboard Tracking State</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-foreground">Mapping Confidence: High</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-foreground">Documents properly extracted</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <span className="font-medium text-foreground">Tool calls identified</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button onClick={nextStep} size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                                Explore Recommended Metrics
                            </Button>
                        </motion.div>
                    )}

                    {/* Screen 7 (User's Screen 8): Smart Metric Packs */}
                    {step === 7 && (
                        <motion.div
                            key="s7"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-4">Based on your agent type, we recommend:</h1>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                    <Bot className="w-4 h-4" /> Detected mode: RAG Agent
                                </div>
                            </div>

                            <div className="space-y-4 mt-8">
                                {[
                                    { id: 'hallucination', title: 'Hallucination & Grounding Pack', desc: 'Checks if answers are supported by retrieved context.' },
                                    { id: 'retrieval', title: 'Retrieval Relevance Pack', desc: 'Evaluates if retrieved documents are helpful for the query.' },
                                    { id: 'tool', title: 'Tool Correctness Pack', desc: 'Validates structure and logic of function calls.' }
                                ].map((pack) => (
                                    <div
                                        key={pack.id}
                                        onClick={() => togglePack(pack.id)}
                                        className={cn(
                                            "p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4",
                                            selectedPacks.includes(pack.id)
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <div className="mt-1">
                                            {selectedPacks.includes(pack.id)
                                                ? <CheckSquare className="w-6 h-6 text-primary" />
                                                : <div className="w-6 h-6 rounded border-2 border-muted-foreground/30" />
                                            }
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg leading-none mb-2">{pack.title}</h3>
                                            <p className="text-muted-foreground text-sm">{pack.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {isProvisioned ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-6"
                                >
                                    <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                        <Sparkles className="w-10 h-10 text-purple-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-purple-900">Agent Configuration Complete!</h2>
                                        <p className="text-purple-800/70 text-lg">Your agent is live and metric packs are active. Ready to start evaluating?</p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            size="lg"
                                            onClick={() => window.location.href = '/dashboard'}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-10"
                                        >
                                            Go to Dashboard
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <Button
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto shadow-xl shadow-purple-500/20"
                                    disabled={isCreating}
                                    onClick={async () => {
                                        if (!createdAgentId) {
                                            toast({ title: "Error", description: "Agent not found. Please restart the process.", variant: "destructive" });
                                            setStep(1);
                                            return;
                                        }
                                        setIsCreating(true);
                                        try {
                                            // 1. Get the current agent data
                                            const existingAgent = await agentService.getOne(createdAgentId);

                                            // 2. Identify the evaluation scope from the selected template
                                            const template = AGENT_TEMPLATES.find(t => t.id === selectedTemplate);
                                            const scope = template?.scope || 'rag';

                                            // 3. Create Metric Packs mapping for each selected pack
                                            const presetMapping: Record<string, string> = {
                                                'hallucination': 'RAG_V1',
                                                'retrieval': 'RAG_V1',
                                                'tool': 'RAG_TOOLS_V1'
                                            };

                                            const provisionedMetricIds: string[] = [];
                                            const selectedPresets = new Set<string>();

                                            for (const pack of selectedPacks) {
                                                const preset = presetMapping[pack];
                                                if (preset) selectedPresets.add(preset);
                                            }

                                            // Consolidation Logic: RAG_TOOLS_V1 is a superset of RAG_V1.
                                            // Creating both for the same scope causes 500 errors on the backend due to layer naming conflicts.
                                            const presetsToCreate = Array.from(selectedPresets);
                                            if (presetsToCreate.includes('RAG_TOOLS_V1') && presetsToCreate.includes('RAG_V1')) {
                                                const index = presetsToCreate.indexOf('RAG_V1');
                                                if (index > -1) presetsToCreate.splice(index, 1);
                                            }

                                            for (const preset of presetsToCreate) {
                                                try {
                                                    const packResponse = await metricPacksService.create({
                                                        metric_pack: {
                                                            name: `${preset.replace(/_/g, ' ')} Pack for ${existingAgent.name}`,
                                                            description: `Auto-provisioned ${preset} pack`,
                                                            evaluation_scope: scope,
                                                            is_active: true,
                                                            version: "1.0.0"
                                                        },
                                                        preset: preset,
                                                        options: {
                                                            judge_model: "gpt-4.1-mini",
                                                            language: "en",
                                                            fail_closed: false
                                                        }
                                                    });
                                                    if (packResponse.metric_ids && packResponse.metric_ids.length > 0) {
                                                        provisionedMetricIds.push(...packResponse.metric_ids);
                                                    }
                                                } catch (err) {
                                                    console.error(`Failed to create preset ${preset}`, err);
                                                }
                                            }

                                            // 4. Update the agent with the new metric IDs
                                            if (provisionedMetricIds.length > 0) {
                                                await agentService.update(createdAgentId, {
                                                    ...existingAgent,
                                                    metrics: [...(existingAgent.metrics || []), ...provisionedMetricIds]
                                                });
                                            }

                                            toast({ title: "Setup Complete", description: "Your agent and metrics have been provisioned!" });
                                            setIsProvisioned(true);

                                            // Navigate to configurations and auto-open the mapping dialog
                                            setTimeout(() => {
                                                navigate(`/configurations/metrics?agentId=${createdAgentId}`);
                                            }, 1500);
                                        } catch (e) {
                                            console.error(e);
                                            toast({ title: "Error", description: "Failed to provision agent metrics.", variant: "destructive" });
                                        } finally {
                                            setIsCreating(false);
                                        }
                                    }}
                                >
                                    {isCreating ? 'Provisioning...' : 'Apply Recommended Metrics'}
                                </Button>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div >
    );
}
