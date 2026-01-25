import React from 'react';

import { Badge } from '@/components/ui/Badge';
import { Copy, ExternalLink } from 'lucide-react';

const EndpointsPage = () => {
    const endpoints = [
        { id: 1, name: "Chat Completion", method: "POST", url: "/v1/chat/completions", latency: "245ms", errors: "0.01%", status: "Healthy" },
        { id: 2, name: "Embeddings", method: "POST", url: "/v1/embeddings", latency: "45ms", errors: "0.00%", status: "Healthy" },
        { id: 3, name: "Agent Action", method: "POST", url: "/v1/agent/action", latency: "850ms", errors: "1.2%", status: "Degraded" },
        { id: 4, name: "List Models", method: "GET", url: "/v1/models", latency: "20ms", errors: "0.00%", status: "Healthy" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Endpoints</h1>
                <p className="text-muted-foreground">Monitor and manage your API endpoints.</p>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3">Endpoint URL</th>
                            <th className="px-6 py-3">Avg Latency</th>
                            <th className="px-6 py-3">Error Rate</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {endpoints.map((ep) => (
                            <tr key={ep.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-medium">{ep.name}</td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className={
                                        ep.method === 'POST' ? 'bg-blue-500/10 text-blue-600 border-blue-200' :
                                            'bg-green-500/10 text-green-600 border-green-200'
                                    }>
                                        {ep.method}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 font-mono text-muted-foreground flex items-center gap-2">
                                    {ep.url}
                                    <Copy className="w-3 h-3 cursor-pointer hover:text-foreground" />
                                </td>
                                <td className="px-6 py-4">{ep.latency}</td>
                                <td className="px-6 py-4">{ep.errors}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ep.status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {ep.status}
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
