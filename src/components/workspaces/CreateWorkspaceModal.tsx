import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaces } from '@/hooks/queries/use-workspaces';
import { useWorkspaceActions } from '@/hooks/use-workspace-actions';
import { tenantService } from '@/services/tenants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Loader2 } from 'lucide-react';

interface CreateWorkspaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceModal({ open, onOpenChange }: CreateWorkspaceModalProps) {
    const { user } = useAuth();
    const { createWorkspace, isCreating } = useWorkspaces();
    const { switchWorkspace, isSwitching } = useWorkspaceActions();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [tenants, setTenants] = useState<any[]>([]);
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');
    const [isLoadingTenants, setIsLoadingTenants] = useState(false);

    // Fetch tenants when modal opens
    useEffect(() => {
        if (open) {
            const fetchTenants = async () => {
                setIsLoadingTenants(true);
                try {
                    const data = await tenantService.getAll();
                    setTenants(data);

                    // Auto-select/Pre-fill logic:
                    if (data && data.length > 0) {
                        if (user?.tenant_id && data.find((t: any) => t.id === user.tenant_id)) {
                            setSelectedTenantId(user.tenant_id);
                        } else {
                            setSelectedTenantId(data[0].id);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch tenants", error);
                } finally {
                    setIsLoadingTenants(false);
                }
            };
            fetchTenants();
        }
    }, [open, user]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        // Auto-generate slug from name if slug hasn't been manually edited (simple heuristic)
        if (!slug || slug === name.toLowerCase().replace(/\s+/g, '-').slice(0, -1)) {
            setSlug(newName.toLowerCase().replace(/\s+/g, '-'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !slug) return;

        const tenantIdToUse = selectedTenantId || user?.tenant_id;

        if (!tenantIdToUse) {
            console.error("No tenant_id selected or found");
            return;
        }

        const payload: any = { name, slug, tenant_id: tenantIdToUse };

        createWorkspace(payload, {
            onSuccess: async (data: any) => {
                // The API returns the created workspace object
                console.log("Workspace created:", data);

                if (data && data.id) {
                    try {
                        console.log("Auto-switching to new workspace:", data.id);
                        await switchWorkspace(data.id);
                    } catch (err) {
                        console.error("Failed to auto-switch to new workspace", err);
                    }
                }

                // Close modal and reset form
                onOpenChange(false);
                setName('');
                setSlug('');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your agents and evaluations.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tenant">Tenant</Label>
                            <select
                                id="tenant"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedTenantId}
                                onChange={(e) => setSelectedTenantId(e.target.value)}
                                disabled={isLoadingTenants || tenants.length === 0}
                            >
                                {isLoadingTenants && <option>Loading tenants...</option>}
                                {!isLoadingTenants && tenants.length === 0 && <option value="">No tenants found</option>}
                                {tenants.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="My Awesome Workspace"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="my-awesome-workspace"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Used in URLs. Must be unique.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating || isSwitching || !name || !slug || !selectedTenantId}>
                            {(isCreating || isSwitching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSwitching ? 'Switching...' : 'Create Workspace'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
