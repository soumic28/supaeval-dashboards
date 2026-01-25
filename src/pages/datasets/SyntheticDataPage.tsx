import React from 'react';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';

const SyntheticDataPage = () => {
    const jobs = [
        { id: 1, name: "Adversarial Attack Set", template: "Security Testing", count: 1000, progress: 100, status: "Completed", time: "10m ago" },
        { id: 2, name: "Customer Inquiries v2", template: "E-commerce Support", count: 5000, progress: 45, status: "Generating", time: "Running" },
        { id: 3, name: "Medical Case Studies", template: "Healthcare", count: 500, progress: 100, status: "Completed", time: "2h ago" },
        { id: 4, name: "Code Refactoring Examples", template: "Programming", count: 2000, progress: 0, status: "Queued", time: "Pending" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Synthetic Data</h1>
                    <p className="text-muted-foreground">Generate high-quality synthetic datasets using AI.</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                    <Sparkles className="w-4 h-4 mr-2" />
                    New Generation Job
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="col-span-2 space-y-6">
                    <div className="border rounded-lg bg-card overflow-hidden">
                        <div className="p-4 border-b border-border/50 font-medium">Recent Jobs</div>
                        <div className="divide-y divide-border">
                            {jobs.map((job) => (
                                <div key={job.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${job.status === 'Generating' ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                                                job.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-muted text-muted-foreground'
                                            }`}>
                                            {job.status === 'Generating' ? <RefreshCw className="w-5 h-5 animate-spin" /> :
                                                job.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                                    <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{job.name}</h4>
                                            <p className="text-sm text-muted-foreground">{job.template} • {job.count} samples</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {job.status === 'Generating' && (
                                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${job.progress}%` }} />
                                            </div>
                                        )}
                                        <div className="text-right">
                                            <Badge variant={
                                                job.status === 'Completed' ? 'default' :
                                                    job.status === 'Generating' ? 'secondary' : 'outline'
                                            }>
                                                {job.status}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">{job.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border rounded-lg bg-card p-6 space-y-4">
                        <h3 className="font-semibold">Templates</h3>
                        <p className="text-sm text-muted-foreground">Start with a pre-built template for common use cases.</p>
                        <div className="space-y-2">
                            {['RAG Evaluation', 'Summarization', 'Sentiment Analysis', 'Code Generation'].map((t) => (
                                <Button key={t} variant="outline" className="w-full justify-start">
                                    <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { FileText } from 'lucide-react';

export default SyntheticDataPage;
