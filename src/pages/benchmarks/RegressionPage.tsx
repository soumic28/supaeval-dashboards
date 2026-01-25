import React from 'react';

const RegressionPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Regression Testing</h1>
                <p className="text-muted-foreground">Monitor performance changes over time.</p>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/10 border-dashed">
                No regression tests configured.
            </div>
        </div>
    );
};

export default RegressionPage;
