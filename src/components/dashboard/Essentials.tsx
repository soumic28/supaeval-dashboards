
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Copy, ExternalLink, Settings, Building2, CreditCard, Activity, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaces } from '@/hooks/queries/use-workspaces';

export function Essentials() {
    const [isOpen, setIsOpen] = useState(true);
    const { user } = useAuth();
    const { workspaces } = useWorkspaces();

    const activeWorkspace = workspaces?.find(w => w.id === user?.workspace_id);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${label} copied to clipboard`,
        });
    };

    return (
        <Card className="mb-8 border-border shadow-none">
            <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/5 rounded-md">
                        {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">Essentials</h2>
                        <p className="text-xs text-muted-foreground">Key resource information</p>
                    </div>
                </div>
            </div>

            {isOpen && (
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Resource Group / Workspace */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Building2 className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wider">Workspace</span>
                            </div>
                            <div className="font-medium text-foreground">{activeWorkspace?.name || "Select Workspace"}</div>
                            <div className="text-xs text-muted-foreground">
                                {activeWorkspace?.is_active !== false ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        {/* Subscription / ID */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Key className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wider">Subscription ID</span>
                            </div>
                            <div className="flex items-center gap-2 group">
                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                                    {activeWorkspace?.subscription_id || '53176444...3fef6'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(activeWorkspace?.subscription_id || '53176444-fb84-4c70-ac9d-f8e36bc3fef6', 'Subscription ID')}
                                >
                                    <Copy className="w-3 h-3 text-muted-foreground" />
                                </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Plan: {activeWorkspace?.plan || 'Standard Plan'}
                            </div>
                        </div>

                        {/* Plan / Pricing */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <CreditCard className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wider">Pricing Tier</span>
                            </div>
                            <div className="font-medium text-foreground">{activeWorkspace?.plan || "Standard Plan"}</div>
                            <Link to="/resource/pricing" className="flex items-center gap-1 text-primary hover:underline cursor-pointer text-xs mt-0.5">
                                <span>Manage subscription</span>
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Agent Info */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Activity className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium uppercase tracking-wider">Active Agent</span>
                            </div>
                            <div className="font-medium text-foreground">Kick_Start Agent</div>
                            <div className="flex items-center gap-1 text-primary hover:underline cursor-pointer text-xs mt-0.5">
                                <span>Configure endpoints</span>
                                <Settings className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
