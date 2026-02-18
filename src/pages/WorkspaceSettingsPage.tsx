
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaces, useUpdateWorkspace, useDeleteWorkspace } from '@/hooks/queries/use-workspaces';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function WorkspaceSettingsPage() {
    const { user } = useAuth();
    const { workspaces, isLoading } = useWorkspaces();
    const { mutateAsync: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace();
    const { mutateAsync: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();

    const currentWorkspace = workspaces?.find(w => w.id === user?.workspace_id);
    const [name, setName] = useState(currentWorkspace?.name || '');



    // Sync name when workspace loads
    useEffect(() => {
        if (currentWorkspace) {
            setName(currentWorkspace.name);
        }
    }, [currentWorkspace]);

    const handleSave = async () => {
        if (!currentWorkspace) return;
        try {
            await updateWorkspace({ id: currentWorkspace.id, data: { name } });
            // specific success handling if needed (toast, etc)
        } catch (error) {
            console.error("Failed to update workspace", error);
        }
    };

    const handleDelete = async () => {
        if (!currentWorkspace) return;
        if (!confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) return;

        try {
            await deleteWorkspace(currentWorkspace.id);
            // Ideally switch to another workspace here or logout, backend/frontend sync needed.
            // For now, let's refresh or redirect home, relying on app auth check to switch if current is gone
            window.location.href = '/';
        } catch (error) {
            console.error("Failed to delete workspace", error);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    if (!currentWorkspace) {
        return (
            <div className="p-8 text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                <h2 className="text-xl font-semibold">Workspace Not Found</h2>
                <p className="text-muted-foreground">The workspace you are looking for does not exist or you do not have access.</p>
                <Button onClick={() => window.location.href = '/'}>Return Home</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
                <p className="text-muted-foreground">Manage your workspace preferences.</p>
            </div>

            <div className="border rounded-lg p-6 bg-card space-y-6">
                <div>
                    <h3 className="text-lg font-medium">General</h3>
                    <p className="text-sm text-muted-foreground">Update your workspace name.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Workspace Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isUpdating || !name || name === currentWorkspace?.name}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg p-6 bg-red-50/50 border-red-200 space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
                    <p className="text-sm text-red-700">Irreversible actions for this workspace.</p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-red-900">Delete Workspace</div>
                        <div className="text-sm text-red-700">Permanently delete this workspace and all its data.</div>
                    </div>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                        Delete Workspace
                    </Button>
                </div>
            </div>
        </div>
    );
}
