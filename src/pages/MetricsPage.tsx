import React from 'react';

const MetricsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
                <p className="text-muted-foreground">Overview of system-wide metrics.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {['Total Requests', 'Avg Latency', 'Error Rate', 'Active Users'].map((metric) => (
                    <div key={metric} className="border rounded-lg p-6 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{metric}</p>
                        <h3 className="text-2xl font-bold">--</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MetricsPage;
