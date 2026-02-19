
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Settings, Play, BarChart2, MessageSquare, Code2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export function QuickNavigations() {
    const navigate = useNavigate();

    const navTiles = [
        { name: 'Datasets', icon: Database, path: '/datasets', color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Configurations', icon: Settings, path: '/configurations', color: 'text-zinc-600', bg: 'bg-zinc-100' },
        { name: 'Evaluations', icon: Play, path: '/evaluations', color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Dashboards', icon: BarChart2, path: '/metrics', color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'RLHF', icon: MessageSquare, path: '/rlhf', color: 'text-orange-600', bg: 'bg-orange-50' },
        { name: 'SDK & API', icon: Code2, path: '/sdk', color: 'text-pink-600', bg: 'bg-pink-50' },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Quick Navigation</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {navTiles.map((tile, index) => (
                    <motion.div
                        key={tile.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(tile.path)}
                        className="cursor-pointer"
                    >
                        <Card className="h-full border-border hover:border-primary/20 hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${tile.bg} ${tile.color}`}>
                                    <tile.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground flex items-center gap-2 group">
                                        {tile.name}
                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-muted-foreground" />
                                    </h3>

                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
