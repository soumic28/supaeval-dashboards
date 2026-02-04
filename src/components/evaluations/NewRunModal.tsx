import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { useNavigate } from 'react-router-dom';
import { Play, Loader2 } from 'lucide-react';

interface NewRunModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewRunModal({ open, onOpenChange }: NewRunModalProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartRun = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            navigate('/evaluations/run-details');
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Start New Evaluation Run</DialogTitle>
                    <DialogDescription>
                        Configure the parameters for your new agent evaluation.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Agent</Label>
                            <Select defaultValue="support-bot-v2">
                                <option value="support-bot-v2">Customer Support V2</option>
                                <option value="sales-agent-v1">Sales Agent V1</option>
                                <option value="coding-assistant">Coding Assistant</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Configuration</Label>
                            <Select defaultValue="prod-standard">
                                <option value="prod-standard">Production Standard</option>
                                <option value="exp-aggressive">Experimental Aggressive</option>
                                <option value="debug-mode">Debug Mode</option>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dataset</Label>
                            <Select defaultValue="golden-set-q4">
                                <option value="golden-set-q4">Golden Set Q4 2024</option>
                                <option value="adversarial-test">Adversarial Test Set</option>
                                <option value="basic-sanity">Basic Sanity Check</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>User Persona</Label>
                            <Select defaultValue="confused-user">
                                <option value="confused-user">Confused User</option>
                                <option value="angry-customer">Angry Customer</option>
                                <option value="technical-expert">Technical Expert</option>
                                <option value="random-visitor">Random Visitor</option>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Context</Label>
                        <Textarea
                            placeholder="Enter any specific context, system prompts overrides, or constraints for this run..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleStartRun} disabled={isLoading} className="gap-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Start Run
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
