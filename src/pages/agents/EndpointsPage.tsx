import React from 'react';

const EndpointsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Endpoints</h1>
                <p className="text-muted-foreground">Manage API endpoints for your agents.</p>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">URL</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[1, 2, 3].map((i) => (
                            <tr key={i} className="hover:bg-muted/50">
                                <td className="px-4 py-3 font-medium">Endpoint {i}</td>
                                <td className="px-4 py-3"><span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">POST</span></td>
                                <td className="px-4 py-3 font-mono text-muted-foreground">/api/v1/agent/{i}/chat</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                        Healthy
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EndpointsPage;
