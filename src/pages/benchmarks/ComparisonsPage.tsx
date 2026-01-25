import React from 'react';

const ComparisonsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Comparisons</h1>
                <p className="text-muted-foreground">Compare model performance across benchmarks.</p>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/10 border-dashed">
                Select models and benchmarks to compare.
            </div>
        </div>
    );
};

export default ComparisonsPage;
