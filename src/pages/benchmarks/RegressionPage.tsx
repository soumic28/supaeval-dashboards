import React from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const RegressionPage = () => {
    const data = [
        { date: 'Jan 1', score: 82.0 },
        { date: 'Jan 8', score: 82.3 },
        { date: 'Jan 15', score: 81.8 },
        { date: 'Jan 22', score: 83.1 },
        { date: 'Jan 29', score: 83.5 },
        { date: 'Feb 5', score: 84.2 },
        { date: 'Feb 12', score: 83.9 },
        { date: 'Feb 19', score: 85.1 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Regression Testing</h1>
                <p className="text-muted-foreground">Monitor performance stability over time.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Model Performance Trend (Prod Chatbot)</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis domain={[80, 90]} className="text-xs" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="Overall Score" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-6 bg-card">
                    <h3 className="font-semibold mb-4">Recent Regressions</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-md border border-red-500/20">
                            <span className="text-sm font-medium">Jan 15 - Drop in Faithfulness</span>
                            <span className="text-red-600 font-bold">-0.5%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-md border border-green-500/20">
                            <span className="text-sm font-medium">Feb 19 - Improvement in Relevance</span>
                            <span className="text-green-600 font-bold">+1.2%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegressionPage;
