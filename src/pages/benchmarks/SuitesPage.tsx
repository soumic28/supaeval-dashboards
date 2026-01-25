import React from 'react';

const SuitesPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Benchmark Suites</h1>
                <p className="text-muted-foreground">Manage and run benchmark suites.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {['MMLU', 'HumanEval', 'GSM8K'].map((suite) => (
                    <div key={suite} className="border rounded-lg p-6 space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <h3 className="font-semibold text-lg">{suite}</h3>
                        <p className="text-sm text-muted-foreground">Standard benchmark suite for evaluating LLM capabilities.</p>
                        <div className="pt-4">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Public</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuitesPage;
