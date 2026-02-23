import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { UserPlus, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TestUser } from '@/types/AgentTypes';

interface AddTestUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agentName?: string;
    onSave?: (user: TestUser) => void;
}

export function AddTestUserDialog({ open, onOpenChange, agentName, onSave }: AddTestUserDialogProps) {
    const [step, setStep] = useState(1);

    // Step 1 State
    const [username, setUsername] = useState('');
    const [memory, setMemory] = useState('');
    const [context, setContext] = useState('');

    // Step 2 State
    const [chatHistory, setChatHistory] = useState('');
    const [longTermMem, setLongTermMem] = useState('');
    const [userType, setUserType] = useState('End Customer');
    const [riskLevel, setRiskLevel] = useState('Low');
    const [queryComplexity, setQueryComplexity] = useState('Simple');
    const [intentType, setIntentType] = useState('Informational');

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSubmit = () => {
        const testUserData: TestUser = {
            id: Date.now().toString(),
            name: username,
            memory,
            context,
            attributes: {
                chatHistory,
                longTermMem,
                userType,
                riskLevel,
                queryComplexity,
                intentType
            }
        };

        if (onSave) {
            onSave(testUserData);
        } else {
            console.log("Test User Data:", testUserData);
            alert('Test user data submitted (Check console)');
        }

        // Reset and close
        setStep(1);
        setUsername('');
        setMemory('');
        setContext('');
        setChatHistory('');
        setLongTermMem('');
        setUserType('End Customer');
        setRiskLevel('Low');
        setQueryComplexity('Simple');
        setIntentType('Informational');

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Add Test User
                        {agentName && <span className="text-muted-foreground font-normal text-sm ml-2">- {agentName}</span>}
                    </DialogTitle>
                    <DialogDescription>
                        Create an Agent Evaluation Profile for testing.
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-2 mt-4">
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>1. Basic Info</span>
                    <span>2. Attributes</span>
                </div>

                <div className="relative min-h-[350px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4 py-2 absolute w-full"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="test_user_01"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="memory">Memory</Label>
                                    <Textarea
                                        id="memory"
                                        placeholder="Simulated short-term and long-term memory used to test contextual understanding and conversation continuity."
                                        value={memory}
                                        onChange={(e) => setMemory(e.target.value)}
                                        className="h-20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="context">Context</Label>
                                    <Textarea
                                        id="context"
                                        placeholder="Represents a realistic end user interacting with the agent for domain-specific queries (e.g., customer support, enterprise search, financial advisory, healthcare FAQ, etc.)."
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        className="h-20"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4 py-2 absolute w-full"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="chatHistory">Chat History (Optional)</Label>
                                        <Input
                                            id="chatHistory"
                                            placeholder="Previous turns..."
                                            value={chatHistory}
                                            onChange={(e) => setChatHistory(e.target.value)}
                                        />
                                        <p className="text-[10px] text-muted-foreground">Stores previous conversation turns</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="longTermMem">Long-Term Mem (Optional)</Label>
                                        <Input
                                            id="longTermMem"
                                            placeholder="Persistent memory data..."
                                            value={longTermMem}
                                            onChange={(e) => setLongTermMem(e.target.value)}
                                        />
                                        <p className="text-[10px] text-muted-foreground">Used to evaluate personalization and recall</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="userType">User Type</Label>
                                        <select
                                            id="userType"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={userType}
                                            onChange={(e) => setUserType(e.target.value)}
                                        >
                                            <option value="End Customer">End Customer</option>
                                            <option value="Internal Analyst">Internal Analyst</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Developer">Developer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="riskLevel">Risk Level</Label>
                                        <select
                                            id="riskLevel"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={riskLevel}
                                            onChange={(e) => setRiskLevel(e.target.value)}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="queryComplexity">Query Complexity</Label>
                                        <select
                                            id="queryComplexity"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={queryComplexity}
                                            onChange={(e) => setQueryComplexity(e.target.value)}
                                        >
                                            <option value="Simple">Simple</option>
                                            <option value="Multi-hop">Multi-hop</option>
                                            <option value="Tool-based">Tool-based</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="intentType">Intent Type</Label>
                                        <select
                                            id="intentType"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={intentType}
                                            onChange={(e) => setIntentType(e.target.value)}
                                        >
                                            <option value="Informational">Informational</option>
                                            <option value="Transactional">Transactional</option>
                                            <option value="Analytical">Analytical</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="mt-8">
                    {step === 1 ? (
                        <div className="flex justify-between w-full">
                            <span /> {/* Spacer */}
                            <Button onClick={handleNext} disabled={!username.trim()}>
                                Next
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between w-full">
                            <Button variant="outline" onClick={handleBack}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={handleSubmit}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Profile
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
