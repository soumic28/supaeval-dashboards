import React from 'react';

const MyDatasetsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Datasets</h1>
                <p className="text-muted-foreground">Manage your personal datasets here.</p>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/10 border-dashed">
                No datasets found. Create one to get started.
            </div>
        </div>
    );
};

export default MyDatasetsPage;
