import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThumbsDown, ArrowRight } from 'lucide-react';

export default function RLHFPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">RLHF & Feedback</h1>
                    <p className="text-muted-foreground">Review user feedback and improve your models.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export Data</Button>
                    <Button>Start Labeling Session</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Feedback Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary">Conversation #102{i}</Badge>
                                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                                        <span className="font-semibold text-primary">User:</span> How do I reset my password?
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-md text-sm">
                                        <span className="font-semibold text-primary">Agent:</span> You can reset your password by clicking on the "Forgot Password" link on the login page.
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <ThumbsDown className="h-4 w-4 text-destructive" />
                                            <span className="text-sm text-muted-foreground">User marked as unhelpful</span>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Review <ArrowRight className="ml-2 h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Pending Review</span>
                                <span className="font-bold">142</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Positive Rate</span>
                                <span className="font-bold">88%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Negative Rate</span>
                                <span className="font-bold">12%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Improvement Tip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Users are consistently marking responses about "Billing" as unhelpful. Consider adding more context to the retrieval base for billing queries.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
