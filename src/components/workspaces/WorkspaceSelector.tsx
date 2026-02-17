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
                console.log("WorkspaceSelector: Auto-selecting first workspace (invalid or missing):", workspaces[0].id);
                // Use hook to switch. It handles state updates.
                switchWorkspace(workspaces[0].id).catch(err => {
                    console.warn("Auto-select switch failed", err);
                });
            }
        }
    }, [isLoading, workspaces, currentWorkspaceId, user, switchWorkspace]);

    // Handle value change
    const onValueChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "__create__") {
            setIsCreateOpen(true);
            e.target.value = currentWorkspaceId;
            return;
        }
        if (value === "__settings__") {
            navigate('/settings/workspace');
            e.target.value = currentWorkspaceId;
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
        <div className="px-2 py-2">
            <CreateWorkspaceModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            <div className="relative">
                <Select
                    value={currentWorkspaceId}
                    onChange={onValueChange}
                    disabled={isLoading || isSwitching}
                    className="w-full pl-9 font-medium truncate pr-8 h-10" // Add padding for icon
                >
                    <option value="" disabled>Select Workspace</option>
                    {workspaces?.map((workspace) => (
                        <option key={workspace.id} value={workspace.id}>
                            {workspace.name}
                        </option>
                    ))}
                    <option disabled>──────────</option>
                    <option value="__create__">+ Create New Workspace</option>
                    <option value="__settings__">⚙ Workspace Settings</option>
                </Select>
                <div className="absolute left-2.5 top-2.5 pointer-events-none text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                </div>
            </div>
            {isSwitching && <div className="text-xs text-center text-muted-foreground mt-1">Switching...</div>}
        </div>
    );
}
