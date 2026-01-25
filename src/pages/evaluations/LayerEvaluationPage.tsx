import { useState, useEffect } from 'react';
import { LayerSimulation } from '../../components/evaluations/LayerSimulation';
import { Button } from '../../components/ui/Button';
import { Play, RotateCcw } from 'lucide-react';

const mockScenario = [
    {
        id: 'input',
        title: '3.1 Input & Intent Layer',
        description: 'Interprets user query, detects intent, constraints, and task type.',
        input: { query: "Book a flight to NYC for next Tuesday, under $500" },
        output: {
            intent: "BookFlight",
            entities: { destination: "NYC", date: "next Tuesday", budget: 500 },
            constraints: ["price < 500"]
        },
        metrics: [
            { name: 'Intent Classification Accuracy', value: '98.5%', status: 'success' },
            { name: 'Constraint Adherence Score', value: '1.0', status: 'success' },
            { name: 'Prompt Ambiguity Score', value: 'Low', status: 'success' },
        ],
        duration: 120,
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
        metrics: [
            { name: 'Plan Accuracy', value: '100%', status: 'success' },
            { name: 'Step Coverage %', value: '100%', status: 'success' },
            { name: 'Reasoning Coherence', value: 'High', status: 'success' },
        ],
        duration: 350,
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
        metrics: [
            { name: 'Context Relevance Score', value: '0.92', status: 'success' },
            { name: 'Recall@K (Simulated)', value: '0.85', status: 'success' },
            { name: 'Grounding Coverage %', value: '100%', status: 'success' },
        ],
        duration: 80,
    },
    {
        id: 'memory',
        title: '3.4 Memory Layer',
        description: 'Stores and retrieves user context and maintains state.',
        input: { session_id: "sess_123", key: "last_search" },
        output: { last_search: null }, // First search in session
        metrics: [
            { name: 'Memory Recall Accuracy', value: '100%', status: 'success' },
            { name: 'Memory Freshness Score', value: '0.98', status: 'success' },
        ],
        duration: 25,
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
        metrics: [
            { name: 'Tool Success Rate', value: '100%', status: 'success' },
            { name: 'Tool Latency', value: '850ms', status: 'warning' },
            { name: 'Tool Selection Accuracy', value: '100%', status: 'success' },
        ],
        duration: 850,
    },
    {
        id: 'generation',
        title: '3.6 Generation Layer',
        description: 'Produces the final user-visible output.',
        input: { flights: 2, context: "Aisle seat preferred" },
        output: {
            response: "I found two flights to NYC under $500. Delta flight DL123 is $450 (Aisle available). Shall I book it?"
        },
        metrics: [
            { name: 'Answer Correctness Score', value: '0.99', status: 'success' },
            { name: 'Hallucination Rate', value: '0.0%', status: 'success' },
            { name: 'Readability Score', value: 'High', status: 'success' },
        ],
        duration: 1200,
    },
    {
        id: 'system',
        title: '3.7 System & Business Layer',
        description: 'Ensures reliability, performance, and ROI.',
        input: { total_tokens: 450, total_time: 2625 },
        output: { cost: "$0.004", status: "Optimal" },
        metrics: [
            { name: 'End-to-End Latency', value: '2.6s', status: 'warning' },
            { name: 'Cost per Query', value: '$0.004', status: 'success' },
            { name: 'User Satisfaction', value: 'High', status: 'success' },
        ],
        duration: 10,
    },
];

const LayerEvaluationPage = () => {
    const [activeStep, setActiveStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isRunning && activeStep < mockScenario.length) {
            const timer = setTimeout(() => {
                setActiveStep(prev => prev + 1);
            }, activeStep === -1 ? 0 : mockScenario[activeStep].duration); // Use mock duration for delay

            return () => clearTimeout(timer);
        } else if (activeStep >= mockScenario.length) {
            setIsRunning(false);
        }
    }, [isRunning, activeStep]);

    const startSimulation = () => {
        setActiveStep(-1);
        setIsRunning(true);
    };

    const resetSimulation = () => {
        setActiveStep(-1);
        setIsRunning(false);
    };

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Layer-by-Layer Evaluation</h1>
                    <p className="text-muted-foreground text-lg">
                        Interactive simulation of the agentic evaluation pipeline.
                    </p>
                </div>
                <div className="flex gap-4">
                    {!isRunning && activeStep === -1 ? (
                        <Button onClick={startSimulation} className="gap-2">
                            <Play className="w-4 h-4" /> Start Simulation
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={resetSimulation} className="gap-2">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="relative">
                {mockScenario.map((layer, index) => (
                    <LayerSimulation
                        key={layer.id}
                        layer={layer as any}
                        isActive={index === activeStep}
                        isCompleted={index < activeStep}
                        isPending={index > activeStep}
                    />
                ))}
            </div>
        </div>
    );
};

export default LayerEvaluationPage;
