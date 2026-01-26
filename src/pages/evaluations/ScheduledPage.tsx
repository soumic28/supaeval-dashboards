

import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MoreVertical, PlayCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ScheduledPage = () => {
    const { toast } = useToast();
    const schedules = [
        { id: 1, name: "Daily Regression Test", config: "Prod Chatbot v2", frequency: "Daily", time: "02:00 UTC", nextRun: "in 4 hours", status: "Active" },
        { id: 2, name: "Weekly Full Benchmark", config: "All Models", frequency: "Weekly", time: "Sunday 00:00 UTC", nextRun: "in 2 days", status: "Active" },
        { id: 3, name: "Hourly Health Check", config: "Smoke Test", frequency: "Hourly", time: ":00", nextRun: "in 15 mins", status: "Active" },
        { id: 4, name: "Monthly Compliance Audit", config: "Safety Policy", frequency: "Monthly", time: "1st of month", nextRun: "in 12 days", status: "Paused" },
    ];

    const handleSchedule = () => {
        toast({
            title: "Schedule Job",
            description: "Job scheduling wizard is coming soon.",
        });
    };

    const handleRunNow = (name: string) => {
        toast({
            title: "Run Job",
            description: `Triggering manual run for ${name}... (Simulated)`,
        });
    };

    const handleMore = (name: string) => {
        toast({
            title: "Options",
            description: `Options for ${name} are not yet implemented.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Scheduled Evaluations</h1>
                    <p className="text-muted-foreground">Manage recurring evaluation jobs and monitors.</p>
                </div>
                <Button onClick={handleSchedule}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule New Job
                </Button>
            </div>

            <div className="grid gap-4">
                {schedules.map((job) => (
                    <div key={job.id} className="border rounded-lg p-6 bg-card flex items-center justify-between hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{job.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span>{job.config}</span>
                                    <span>•</span>
                                    <span>{job.frequency} at {job.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-sm font-medium">Next Run</div>
                                <div className="text-sm text-muted-foreground">{job.nextRun}</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                {job.status}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleRunNow(job.name)}>
                                    <PlayCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleMore(job.name)}>
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduledPage;
