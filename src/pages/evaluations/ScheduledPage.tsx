import React from 'react';

const ScheduledPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Scheduled Evaluations</h1>
                <p className="text-muted-foreground">Manage scheduled evaluation jobs.</p>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/10 border-dashed">
                No scheduled evaluations found.
            </div>
        </div>
    );
};

export default ScheduledPage;
