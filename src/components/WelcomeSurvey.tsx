import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useState } from 'react';
import { useUserProfile, type UserRole } from '@/contexts/UserProfileContext';
import { BarChart3, Code2, GraduationCap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeSurveyProps {
    open: boolean;
    onComplete: () => void;
}

export function WelcomeSurvey({ open, onComplete }: WelcomeSurveyProps) {
    const { updateProfile } = useUserProfile();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const roles: { value: UserRole; icon: typeof BarChart3; label: string; description: string }[] = [
        {
            value: 'manager',
            icon: BarChart3,
            label: 'Monitor AI Performance',
            description: 'Business metrics and team reports'
        },
        {
            value: 'developer',
            icon: Code2,
            label: 'Evaluate & Develop AI',
            description: 'Technical evaluation and testing'
        },
        {
            value: 'student',
            icon: GraduationCap,
            label: 'Academic Project',
            description: 'Research and learning'
        },
        {
            value: 'investor',
            icon: TrendingUp,
            label: 'Due Diligence',
            description: 'Verify AI startup claims'
        },
    ];

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setStep(2);
    };

    const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
        // Determine complexity mode based on role and level
        let complexity: 'simple' | 'balanced' | 'advanced' = 'balanced';

        if (level === 'beginner' || selectedRole === 'manager') {
            complexity = 'simple';
        } else if (level === 'advanced' || selectedRole === 'developer') {
            complexity = 'advanced';
        }

        // Update profile
        updateProfile({
            role: selectedRole!,
            complexity,
            showOnboarding: true
        });

        onComplete();
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-xl">
                {step === 1 && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Welcome to SupaEval!</DialogTitle>
                            <p className="text-muted-foreground">
                                Let's personalize your experience. What brings you here?
                            </p>
                        </DialogHeader>

                        <div className="grid gap-3 py-4">
                            {roles.map((role, index) => (
                                <motion.button
                                    key={role.value}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleRoleSelect(role.value)}
                                    className="flex items-start gap-4 p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-accent transition-colors"
                                >
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <role.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{role.label}</h3>
                                        <p className="text-sm text-muted-foreground">{role.description}</p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">One more thing...</DialogTitle>
                            <p className="text-muted-foreground">
                                How would you describe your technical experience?
                            </p>
                        </DialogHeader>

                        <div className="grid gap-3 py-4">
                            {[
                                { value: 'beginner' as const, label: 'Beginner', desc: 'New to AI evaluation' },
                                { value: 'intermediate' as const, label: 'Intermediate', desc: 'Some experience with AI' },
                                { value: 'advanced' as const, label: 'Advanced', desc: 'Experienced AI practitioner' },
                            ].map((level, index) => (
                                <motion.button
                                    key={level.value}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleLevelSelect(level.value)}
                                    className="flex items-center justify-between p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-accent transition-colors"
                                >
                                    <div>
                                        <h3 className="font-medium">{level.label}</h3>
                                        <p className="text-sm text-muted-foreground">{level.desc}</p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
