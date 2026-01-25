import React from 'react';

import { Button } from '@/components/ui/Button';
import { FileText, Database, MoreHorizontal, Plus } from 'lucide-react';

const MyDatasetsPage = () => {
    const datasets = [
        { id: 1, name: "Customer Support Logs Q4", type: "JSON", rows: "12,500", size: "4.2 MB", created: "2 days ago", status: "Ready" },
        { id: 2, name: "Product Reviews 2023", type: "CSV", rows: "45,000", size: "15.8 MB", created: "1 week ago", status: "Ready" },
        { id: 3, name: "Legal Document Corpus", type: "PDF", rows: "1,200", size: "128 MB", created: "2 weeks ago", status: "Processing" },
        { id: 4, name: "Medical QA Pairs", type: "JSON", rows: "5,000", size: "2.1 MB", created: "3 weeks ago", status: "Ready" },
        { id: 5, name: "Code Snippets (Python)", type: "TXT", rows: "8,500", size: "8.4 MB", created: "1 month ago", status: "Ready" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Datasets</h1>
                    <p className="text-muted-foreground">Manage your personal datasets here.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Dataset
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Rows</th>
                            <th className="px-6 py-3">Size</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {datasets.map((dataset) => (
                            <tr key={dataset.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                        {dataset.type === 'JSON' ? <Database className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    {dataset.name}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.type}</td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.rows}</td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.size}</td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.created}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dataset.status === 'Ready'
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {dataset.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyDatasetsPage;
