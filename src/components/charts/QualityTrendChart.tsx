import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const data = [
    { name: 'Mon', quality: 82, latency: 1.4 },
    { name: 'Tue', quality: 84, latency: 1.3 },
    { name: 'Wed', quality: 83, latency: 1.5 },
    { name: 'Thu', quality: 86, latency: 1.2 },
    { name: 'Fri', quality: 88, latency: 1.1 },
    { name: 'Sat', quality: 89, latency: 1.1 },
    { name: 'Sun', quality: 87, latency: 1.2 },
];

export function QualityTrendChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Quality vs Latency Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="name"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}s`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="quality" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Quality Score" />
                            <Line yAxisId="right" type="monotone" dataKey="latency" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Latency (s)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
