import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Circle, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    action: string; // Route to navigate to
}

export function OnboardingChecklist() {
    const { profile, updateProfile } = useUserProfile();
    const navigate = useNavigate();
    const [items, setItems] = useState<ChecklistItem[]>([
        {
            id: 'profile',
            label: 'Set up your profile',
            description: 'Complete your user profile',
            completed: false,
            action: '/settings'
        },
        {
            id: 'first-eval',
            label: 'Run first evaluation',
            description: 'Create and run your first evaluation',
            completed: false,
            action: '/evaluations/runs'
        },
        {
            id: 'view-results',
            label: 'View results',
            description: 'Check your evaluation results',
            completed: false,
            action: '/evaluations/runs'
        },
        {
            id: 'share-report',
            label: 'Share a report',
            description: 'Share insights with your team',
            completed: false,
            action: '/evaluations/runs'
        },
        {
            id: 'invite-teammate',
            label: 'Invite a teammate',
            description: 'Collaborate with your team',
            completed: false,
            action: '/team'
        },
    ]);

    if (!profile.showOnboarding) {
        return null;
    }

    const completedCount = items.filter(item => item.completed).length;
    const progress = (completedCount / items.length) * 100;

    const handleDismiss = () => {
        updateProfile({ showOnboarding: false });
    };

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleItemClick = (item: ChecklistItem) => {
        // Navigate to the action page
        navigate(item.action);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base">Getting Started</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Complete these steps to get the most out of SupaEval</p>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-muted rounded-sm transition-colors"
                            aria-label="Dismiss checklist"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    {/* Checkbox button */}
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="p-1 hover:bg-accent rounded transition-colors"
                                        aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                    >
                                        {item.completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                    </button>

                                    {/* Clickable item that navigates */}
                                    <button
                                        onClick={() => handleItemClick(item)}
                                        className="flex-1 flex items-center justify-between p-2 hover:bg-accent/50 rounded-md transition-colors text-left group"
                                    >
                                        <div className="flex-1">
                                            <div className={item.completed ? 'text-sm font-medium text-muted-foreground line-through' : 'text-sm font-medium'}>
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.description}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-primary"
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {completedCount} of {items.length} complete
                            </p>
                        </div>

                        {completedCount === items.length && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                            >
                                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                                    🎉 All done! You're ready to go!
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                    You can now use all features of SupaEval
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
