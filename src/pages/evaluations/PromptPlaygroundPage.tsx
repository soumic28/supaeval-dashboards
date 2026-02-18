import { useState, useEffect } from 'react';
import { LayerSimulation } from '../../components/evaluations/LayerSimulation';
import { Button } from '../../components/ui/Button';
import { Play, RotateCcw, Settings2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';

// Base scenario data
const baseScenario = [
    {
        id: 'input',
        title: '3.1 Input & Intent Layer',
        description: 'Interprets user query, detects intent, constraints, and task type.',
        input: { query: "" }, // Dynamic
        output: {
            intent: "BookFlight",
            entities: { destination: "NYC", date: "next Tuesday", budget: 500 },
            constraints: ["price < 500"]
        },
        failureModes: [
            'Misclassified intent (fact vs reasoning vs action)',
            'Ignoring constraints (tone, length, format)',
            'Over-verbose or under-informative responses',
        ],
        evaluationMethods: [
            'LLM-as-Judge on intent classification',
            'Rule-based validation (length, format)',
            'Golden prompt datasets',
        ],
        duration: 800,
    },
    {
        id: 'planning',
        title: '3.2 Planning & Reasoning Layer',
        description: 'Breaks the task into steps, chooses tools, and determines execution order.',
        input: { intent: "BookFlight", entities: { destination: "NYC", date: "2024-05-21" } },
        output: {
            plan: [
                { step: 1, tool: "FlightSearchAPI", params: { to: "JFK", max_price: 500 } },
                { step: 2, tool: "UserConfirmation", params: { type: "selection" } }
            ]
        },
        failureModes: [
            'Incorrect plan',
            'Missing steps',
            'Over-planning or unnecessary reasoning',
            'Hallucinated intermediate steps',
        ],
        evaluationMethods: [
            'Plan correctness vs golden plans',
            'Step coverage analysis',
            'LLM-based reasoning coherence scoring',
        ],
        duration: 1200,
    },
    {
        id: 'retrieval',
        title: '3.3 Retrieval & Context Layer',
        description: 'Fetches documents, chunks, or structured data for grounding.',
        input: { context_keys: ["user_preferences", "flight_history"] },
        output: {
            context: {
                preferred_airline: "Delta",
                seat_preference: "Aisle"
            }
        },
        failureModes: [
            'Irrelevant documents retrieved',
            'Missing critical documents',
            'Too much / too little context',
            'Similar-name or stale data confusion',
        ],
        evaluationMethods: [
            'IR metrics on labeled datasets',
            'Context attribution checks',
            'Multi-modal retrieval validation (tables, images)',
        ],
        duration: 600,
    },
    {
        id: 'memory',
        title: '3.4 Memory Layer',
        description: 'Stores and retrieves user context and maintains state.',
        input: { session_id: "sess_123", key: "last_search" },
        output: { last_search: null }, // First search in session
        failureModes: [
            'Forgetting important facts',
            'Using stale or incorrect memory',
            'Privacy or scope violations',
        ],
        evaluationMethods: [
            'Scenario-based replay with memory',
            'Time-decay and overwrite tests',
            'Judge-based relevance scoring',
        ],
        duration: 300,
    },
    {
        id: 'tool',
        title: '3.5 Tool & Action Layer',
        description: 'Calls external tools, parses outputs, and handles failures.',
        input: { tool: "FlightSearchAPI", params: { to: "JFK", max_price: 500 } },
        output: {
            status: 200,
            data: { flights: [{ id: "DL123", price: 450 }, { id: "UA456", price: 480 }] }
        },
        failureModes: [
            'Wrong tool selection',
            'Incorrect parameters',
            'Ignoring tool errors',
            'Partial execution without recovery',
        ],
        evaluationMethods: [
            'Deterministic test harness',
            'Mock tool execution',
            'Contract validation',
        ],
        duration: 1500,
    },
    {
        id: 'generation',
        title: '3.6 Generation Layer',
        description: 'Produces the final user-visible output.',
        input: { flights: 2, context: "Aisle seat preferred" },
        output: {
            response: "I found two flights to NYC under $500. Delta flight DL123 is $450 (Aisle available). Shall I book it?"
        },
        failureModes: [
            'Hallucinations',
            'Incorrect facts',
            'Poor structure or tone',
            'Safety violations',
        ],
        evaluationMethods: [
            'LLM-as-Judge (rubric-based)',
            'Human review (spot checks)',
            'Automated factual consistency checks',
        ],
        duration: 2000,
    },
    {
        id: 'system',
        title: '3.7 System & Business Layer',
        description: 'Ensures reliability, performance, and ROI.',
        input: { total_tokens: 450, total_time: 2625 },
        output: { cost: "$0.004", status: "Optimal" },
        failureModes: [
            'High latency',
            'Token overuse',
            'Poor user satisfaction',
            'Cost overruns',
        ],
        evaluationMethods: [
            'Production telemetry',
            'A/B testing',
            'User feedback loops',
        ],
        duration: 100,
    },
];

// Metrics for different modes
const metricsByMode = {
    offline: [
        [ // Input
            { name: 'Intent Classification Accuracy', value: '98.5%', status: 'success' },
            { name: 'Constraint Adherence Score', value: '1.0', status: 'success' },
        ],
        [ // Planning
            { name: 'Plan Accuracy', value: '100%', status: 'success' },
            { name: 'Step Coverage %', value: '100%', status: 'success' },
        ],
        [ // Retrieval
            { name: 'Recall@K', value: '0.85', status: 'success' },
            { name: 'Precision@K', value: '0.92', status: 'success' },
        ],
        [ // Memory
            { name: 'Memory Recall Accuracy', value: '100%', status: 'success' },
        ],
        [ // Tool
            { name: 'Tool Selection Accuracy', value: '100%', status: 'success' },
            { name: 'Tool Success Rate', value: '100%', status: 'success' },
        ],
        [ // Generation
            { name: 'Answer Correctness Score', value: '0.99', status: 'success' },
            { name: 'Hallucination Rate', value: '0.0%', status: 'success' },
        ],
        [ // System
            { name: 'Success Rate', value: '100%', status: 'success' },
        ]
    ],
    online: [
        [ // Input
            { name: 'Prompt Ambiguity Score', value: 'Low', status: 'success' },
            { name: 'Over-response Rate', value: '0.02', status: 'success' },
        ],
        [ // Planning
            { name: 'Reasoning Coherence', value: 'High', status: 'success' },
            { name: 'Hallucinated Step Rate', value: '0%', status: 'success' },
        ],
        [ // Retrieval
            { name: 'Context Relevance Score', value: '0.92', status: 'success' },
            { name: 'Retrieval Latency', value: '45ms', status: 'success' },
        ],
        [ // Memory
            { name: 'Memory Freshness Score', value: '0.98', status: 'success' },
            { name: 'Privacy Violation Rate', value: '0%', status: 'success' },
        ],
        [ // Tool
            { name: 'Tool Latency', value: '850ms', status: 'warning' },
            { name: 'Retry Recovery Rate', value: 'N/A', status: 'success' },
        ],
        [ // Generation
            { name: 'Readability Score', value: 'High', status: 'success' },
            { name: 'Safety Compliance', value: 'Pass', status: 'success' },
        ],
        [ // System
            { name: 'End-to-End Latency', value: '2.6s', status: 'warning' },
            { name: 'Cost per Query', value: '$0.004', status: 'success' },
            { name: 'User Satisfaction', value: 'High', status: 'success' },
        ]
    ]
};

const PromptPlaygroundPage = () => {
    const [activeStep, setActiveStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [userQuery, setUserQuery] = useState("Book a flight to NYC for next Tuesday, under $500");
    const [scenario, setScenario] = useState(baseScenario);
    const [expandAll, setExpandAll] = useState(false);

    // Initialize scenario with hybrid metrics (combining offline and online)
    useEffect(() => {
        const newScenario = baseScenario.map((layer, index) => {
            // Hybrid: Combine a subset of both offline and online metrics
            const metrics = [
                ...metricsByMode.offline[index].slice(0, 1),
                ...metricsByMode.online[index].slice(0, 2)
            ];
            return { ...layer, metrics };
        });
        setScenario(newScenario);
    }, []);

    useEffect(() => {
        if (isRunning && activeStep < scenario.length) {
            const timer = setTimeout(() => {
                setActiveStep(prev => prev + 1);
            }, activeStep === -1 ? 0 : scenario[activeStep].duration);

            return () => clearTimeout(timer);
        } else if (activeStep >= scenario.length) {
            setIsRunning(false);
        }
    }, [isRunning, activeStep, scenario]);

    const startSimulation = () => {
        // Update input layer with user query
        const updatedScenario = [...scenario];
        updatedScenario[0].input = { query: userQuery };
        setScenario(updatedScenario);

        setActiveStep(-1);
        setIsRunning(true);
    };

    const resetSimulation = () => {
        setActiveStep(-1);
        setIsRunning(false);
    };

    const toggleSettings = () => {
        setExpandAll(!expandAll);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Prompt Playground</h1>
                        <p className="text-muted-foreground text-lg">
                            Interactive simulation of the agentic evaluation pipeline.
                        </p>
                    </div>
                </div>

                <Card className="p-6 border-primary/20 bg-primary/5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-sm font-medium text-foreground">Test Query</label>
                            <input
                                type="text"
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Enter a query to test..."
                                disabled={isRunning}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {!isRunning && activeStep === -1 ? (
                                <Button onClick={startSimulation} className="gap-2 w-full sm:w-auto min-w-[140px]">
                                    <Play className="w-4 h-4" /> Start Evaluation
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={resetSimulation} className="gap-2 w-full sm:w-auto min-w-[140px]">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </Button>
                            )}
                            <Button
                                variant={expandAll ? "default" : "ghost"}
                                size="icon"
                                onClick={toggleSettings}
                                title={expandAll ? "Collapse All" : "Expand All"}
                                className="hidden sm:flex"
                            >
                                <Settings2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={expandAll ? "default" : "outline"}
                                onClick={toggleSettings}
                                className="gap-2 w-full sm:hidden"
                            >
                                <Settings2 className="w-4 h-4" /> {expandAll ? "Collapse All" : "Expand All"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="relative space-y-2">
                {scenario.map((layer, index) => (
                    <LayerSimulation
                        key={layer.id}
                        layer={layer as any}
                        isActive={index === activeStep || expandAll}
                        isCompleted={index < activeStep}
                        isPending={index > activeStep && !expandAll}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromptPlaygroundPage;
