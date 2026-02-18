
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Copy, Terminal, Activity, Play, Check, ArrowRight, Code2, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function GetStarted() {
    const [step, setStep] = useState(1);
    const [evalProgress, setEvalProgress] = useState(0);
    const [isEvalRunning, setIsEvalRunning] = useState(false);

    // Mock evaluation run simulation
    useEffect(() => {
        if (isEvalRunning) {
            setEvalProgress(0);
            const interval = setInterval(() => {
                setEvalProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsEvalRunning(false);
                        setStep(5); // Auto-advance to Results
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isEvalRunning]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Code snippet copied to clipboard",
        });
    };

    const nextStep = () => setStep(step + 1);

    const steps = [
        { id: 1, label: "Welcome", icon: Sparkles },
        { id: 2, label: "Installation", icon: Terminal },
        { id: 3, label: "Create Evaluation", icon: Code2 },
        { id: 4, label: "Run & Monitor", icon: Play },
        { id: 5, label: "View Results", icon: Activity }
    ];

    const quickstartCode = `from supaeval import SupaEval

# Initialize with your API key
client = SupaEval(api_key="sk_live_53176...")

# Create a dataset
dataset = client.datasets.create(
    name="quickstart-dataset",
    description="My first evaluation"
)

# Add a test case
dataset.add_items([{
    "input": "What is 2 + 2?",
    "expected_output": "4"
}])

# Run evaluation
evaluation = client.evaluations.create(
    dataset_id=dataset.id, 
    agent_endpoint="https://your-agent.api/chat",
    metrics=["accuracy", "relevance"]
)

# Get results
results = evaluation.get_results()
print(f"Score: {results.overall_score}")`;

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
                    {/* Step 1: Welcome */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-2xl"
                        >
                            <div className="space-y-4">
                                <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Quick Start
                                </Badge>
                                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                    Quality Intelligence for AI Agents<br />
                                    <span className="text-muted-foreground">in under 5 minutes.</span>
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Create datasets, run evaluations, and benchmark your agents with a few lines of code.
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button size="lg" onClick={nextStep} className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                                    Start Installation
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Read Docs
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Installation */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Install the SDK</h1>
                                <p className="text-muted-foreground">Install the SupaEval Python SDK to get started.</p>
                            </div>

                            <Card className="bg-zinc-950 border-zinc-900 shadow-xl">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <code className="font-mono text-sm text-zinc-100">
                                        pip install supaeval
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-white hover:bg-white/10"
                                        onClick={() => copyToClipboard('pip install supaeval')}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>

                            <Button onClick={nextStep} size="lg">
                                I've installed the SDK
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 3: Create Evaluation Script */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Create Evaluation Script</h1>
                                <p className="text-muted-foreground">Copy this script to create a dataset and run your first evaluation.</p>
                            </div>

                            <Card className="bg-zinc-950 border-zinc-900 shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/50">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-zinc-400 hover:text-white hover:bg-white/10"
                                        onClick={() => copyToClipboard(quickstartCode)}
                                    >
                                        <Copy className="w-3 h-3 mr-2" />
                                        Copy
                                    </Button>
                                </div>
                                <div className="p-6 overflow-x-auto">
                                    <pre className="font-mono text-sm leading-relaxed text-zinc-300">
                                        <code>{quickstartCode}</code>
                                    </pre>
                                </div>
                            </Card>

                            <Button onClick={nextStep} size="lg">
                                Run Evaluation
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 4: Run & Monitor */}
                    {step === 4 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 max-w-3xl"
                        >
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-2">Running Evaluation...</h1>
                                <p className="text-muted-foreground">Execute the script in your terminal. We're listening for the results.</p>
                            </div>

                            <Card className="border-border">
                                <CardContent className="p-12 space-y-8">
                                    {!isEvalRunning ? (
                                        <div className="text-center space-y-6">
                                            <div className="p-4 rounded-full bg-muted inline-block">
                                                <Terminal className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-medium">Waiting for script execution...</h3>
                                                <p className="text-sm text-muted-foreground">Run <code>python evaluation.py</code> in your terminal</p>
                                            </div>
                                            <Button onClick={() => setIsEvalRunning(true)} variant="outline">
                                                Simulate Run (Demo)
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">quickstart-dataset</span>
                                                <span className="text-muted-foreground">Running metrics...</span>
                                            </div>
                                            <Progress value={evalProgress} className="h-2" />
                                            <div className="grid grid-cols-3 gap-4 text-center text-sm pt-4">
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Test Cases</div>
                                                    <div className="font-medium">1/1</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Latency</div>
                                                    <div className="font-medium">~850ms</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Status</div>
                                                    <div className="text-blue-600 font-medium animate-pulse">Processing</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 5: View Results */}
                    {step === 5 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-8 max-w-4xl"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-2">Evaluation Complete</h1>
                                    <p className="text-muted-foreground">Great job! Here are the results from your first run.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">View Full Report</Button>
                                    <Button>Create New Dataset</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-green-50/50 border-green-200">
                                    <CardContent className="p-6 space-y-2">
                                        <div className="text-sm font-medium text-green-800">Overall Score</div>
                                        <div className="text-4xl font-bold text-green-700">0.92</div>
                                        <div className="text-xs text-green-600">Across 2 metrics</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Accuracy</div>
                                        <div className="text-2xl font-bold text-foreground">1.00</div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-full" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6 space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Relevance</div>
                                        <div className="text-2xl font-bold text-foreground">0.85</div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 w-[85%]" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="rounded-lg border border-border overflow-hidden">
                                <div className="bg-muted/50 px-4 py-3 border-b border-border text-sm font-medium">
                                    Test Case Results
                                </div>
                                <div className="divide-y divide-border">
                                    <div className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                                        <div className="mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="text-sm font-medium">Input: "What is 2 + 2?"</div>
                                            <div className="text-sm text-muted-foreground">Output: "4"</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Pass</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
