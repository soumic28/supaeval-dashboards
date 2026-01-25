import React from 'react';

const SyntheticDataPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Synthetic Data</h1>
                <p className="text-muted-foreground">Generate and manage synthetic datasets.</p>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/10 border-dashed">
                Generate synthetic data to augment your datasets.
            </div>
        </div>
    );
};

export default SyntheticDataPage;
