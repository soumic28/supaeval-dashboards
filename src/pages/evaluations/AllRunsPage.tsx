import React from 'react';

const AllRunsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">All Runs</h1>
                <p className="text-muted-foreground">View all evaluation runs.</p>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-4 py-3">Run ID</th>
                            <th className="px-4 py-3">Dataset</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-muted/50">
                                <td className="px-4 py-3 font-mono">run_{1000 + i}</td>
                                <td className="px-4 py-3">dataset_v{i}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                        Completed
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">2023-10-{10 + i}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllRunsPage;
