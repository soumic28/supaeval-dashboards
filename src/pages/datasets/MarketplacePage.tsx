import React from 'react';

const MarketplacePage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                <p className="text-muted-foreground">Explore datasets from the community.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="h-32 bg-muted/20 rounded-md mb-4"></div>
                        <h3 className="font-semibold">Dataset {i}</h3>
                        <p className="text-sm text-muted-foreground">A sample dataset for evaluation tasks.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;
