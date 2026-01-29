import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, Download, Share2 } from 'lucide-react';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';

export function ExecutiveSummaryCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Business Metrics */}
                <div>
                    <h4 className="text-sm font-medium mb-3">This Week's Performance</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <EnhancedTooltip
                                title="AI Success Rate"
                                content="The percentage of customer inquiries that your AI successfully handled without requiring human intervention."
                                example="94.2% means 94 out of every 100 customer questions were resolved by your AI."
                            >
                                <span className="text-sm text-muted-foreground">AI Success Rate</span>
                            </EnhancedTooltip>
                            <span className="text-sm font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <EnhancedTooltip
                                title="Total Inquiries Handled"
                                content="The total number of customer interactions processed by your AI this week."
                            >
                                <span className="text-sm text-muted-foreground">Total Inquiries Handled</span>
                            </EnhancedTooltip>
                            <span className="text-sm font-medium">1,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <EnhancedTooltip
                                title="Estimated Cost Savings"
                                content="Calculated based on average support ticket cost ($6.75) multiplied by inquiries successfully handled by AI."
                                formula="Cost Savings = Successful Inquiries × Avg Ticket Cost"
                            >
                                <span className="text-sm text-muted-foreground">Estimated Cost Savings</span>
                            </EnhancedTooltip>
                            <span className="text-sm font-medium text-green-600">$8,400</span>
                        </div>
                    </div>
                </div>

                {/* Trend */}
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Up 3% from last week</span>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" />
                        Download Report
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share with Team
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
