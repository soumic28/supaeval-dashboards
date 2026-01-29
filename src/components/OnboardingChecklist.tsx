import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Circle, X } from 'lucide-react';
import { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

export function OnboardingChecklist() {
    const { profile, updateProfile } = useUserProfile();
    const [items] = useState<ChecklistItem[]>([
        { id: 'profile', label: 'Set up your profile', completed: false },
        { id: 'first-eval', label: 'Run first evaluation', completed: false },
        { id: 'view-results', label: 'View results', completed: false },
        { id: 'share-report', label: 'Share a report', completed: false },
        { id: 'invite-teammate', label: 'Invite a teammate', completed: false },
    ]);

    if (!profile.showOnboarding) {
        return null;
    }

    const completedCount = items.filter(item => item.completed).length;
    const progress = (completedCount / items.length) * 100;

    const handleDismiss = () => {
        updateProfile({ showOnboarding: false });
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
                        <CardTitle className="text-base">Getting Started</CardTitle>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-muted rounded-sm transition-colors"
                            aria-label="Dismiss checklist"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    {item.completed ? (
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className={item.completed ? 'text-sm text-muted-foreground line-through' : 'text-sm'}>
                                        {item.label}
                                    </span>
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
                                className="text-sm text-green-600 font-medium"
                            >
                                All done! You're ready to go! 🎉
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
