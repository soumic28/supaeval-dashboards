import React from 'react';

const ConnectedAgentsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Connected Agents</h1>
                <p className="text-muted-foreground">Manage your AI agents connected to the platform.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {['Customer Support Bot', 'Internal QA Agent', 'Sales Assistant'].map((agent) => (
                    <div key={agent} className="border rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {agent[0]}
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                Active
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold">{agent}</h3>
                            <p className="text-sm text-muted-foreground">Last active: 2 mins ago</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectedAgentsPage;
