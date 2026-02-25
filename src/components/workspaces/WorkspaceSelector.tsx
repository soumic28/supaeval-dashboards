import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaces } from '@/hooks/queries/use-workspaces';
import { useWorkspaceActions } from '@/hooks/use-workspace-actions';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { Select } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';
import { Building2 } from 'lucide-react';

export function WorkspaceSelector() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { workspaces, isLoading } = useWorkspaces();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { switchWorkspace, isSwitching } = useWorkspaceActions();


    // Current workspace from user object
    const currentWorkspaceId = user?.workspace_id || "";



    // Auto-select first workspace if none selected OR if selected is invalid
    useEffect(() => {
        if (!isLoading && workspaces && workspaces.length > 0 && user) {
            const isValid = workspaces.find(w => w.id === currentWorkspaceId);

            if (!currentWorkspaceId || !isValid) {
                const fallbackWorkspace = workspaces.find(w => w.is_active) || workspaces[0];
                console.log("WorkspaceSelector: Auto-selecting fallback workspace:", fallbackWorkspace.id);
                // Use hook to switch. It handles state updates.
                switchWorkspace(fallbackWorkspace.id).catch(err => {
                    console.warn("Auto-select switch failed", err);
                });
            }
        }
    }, [isLoading, workspaces, currentWorkspaceId, user, switchWorkspace]);

    const activeWorkspace = workspaces?.find(w => w.id === currentWorkspaceId) || workspaces?.find(w => w.is_active) || workspaces?.[0];

    // Handle value change
    const onValueChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "__create__") {
            setIsCreateOpen(true);
            e.target.value = activeWorkspace?.id || "";
            return;
        }
        if (value === "__settings__") {
            navigate('/settings/workspace');
            e.target.value = activeWorkspace?.id || "";
            return;
        }

        if (value === currentWorkspaceId) {
            return;
        }

        console.log("WorkspaceSelector: User initiating switch to:", value);
        await switchWorkspace(value);
    };



    if (isLoading) return <div className="p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>;

    return (
        <div className="px-1 py-1">
            <CreateWorkspaceModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-2 px-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Workspace</span>
                </div>

                <div className="relative">
                    <Select
                        key={activeWorkspace?.id || "empty"}
                        value={activeWorkspace?.id || ""}
                        onChange={onValueChange}
                        disabled={isLoading || isSwitching}
                        className="w-full h-9 text-sm font-medium bg-muted/30 border-border/50 hover:bg-muted/80 transition-colors focus:ring-1 focus:ring-primary/20"
                    >
                        {!activeWorkspace && <option value="" disabled>Select Workspace</option>}
                        {workspaces?.map((workspace) => (
                            <option key={workspace.id} value={workspace.id}>
                                {workspace.name}
                            </option>
                        ))}
                        <option disabled>──────────</option>
                        <option value="__create__">+ Create New Workspace</option>
                        <option value="__settings__">⚙ Workspace Settings</option>
                    </Select>
                </div>

                <div className="flex items-center px-1 pt-1.5">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            {activeWorkspace?.is_active !== false && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${activeWorkspace?.is_active !== false ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                            {activeWorkspace?.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
            {isSwitching && <div className="text-[10px] text-center text-muted-foreground mt-2 animate-pulse">Switching workspace...</div>}
        </div>
    );
}
