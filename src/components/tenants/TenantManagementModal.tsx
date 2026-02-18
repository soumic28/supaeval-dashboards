import { useState, useEffect } from 'react';
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
} from '@/components/ui/Dialog';
import { TenantCard } from './TenantCard';
import { Loader2, Plus, Building2 } from 'lucide-react';
import type { Tenant } from '@/types/models';

interface TenantManagementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TenantManagementModal({ open, onOpenChange }: TenantManagementModalProps) {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [tenantName, setTenantName] = useState('');
    const [tenantSlug, setTenantSlug] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            fetchTenants();
        }
    }, [open]);

    const fetchTenants = async () => {
        setIsLoading(true);
        try {
            const data = await tenantService.getAll();
            setTenants(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tenants');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTenantNameChange = (value: string) => {
        setTenantName(value);
        if (!tenantSlug || tenantSlug === tenantName.toLowerCase().replace(/\s+/g, '-').slice(0, -1)) {
            setTenantSlug(value.toLowerCase().replace(/\s+/g, '-'));
        }
    };

    const handleCreateTenant = async () => {
        if (!tenantName || !tenantSlug) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const newTenant = await tenantService.create({
                name: tenantName,
                slug: tenantSlug,
            });

            setTenants([...tenants, newTenant]);
            setTenantName('');
            setTenantSlug('');
            setShowCreateForm(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create tenant');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTenant = async (tenantId: string) => {
        if (!confirm('Are you sure you want to delete this tenant?')) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await tenantService.delete(tenantId);
            setTenants(tenants.filter(t => t.id !== tenantId));
        } catch (err: any) {
            setError(err.message || 'Failed to delete tenant');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <DialogTitle>Manage Tenants</DialogTitle>
                            <DialogDescription>
                                View and manage your organization tenants
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {isLoading && tenants.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            {/* Tenant List */}
                            <div className="space-y-3">
                                {tenants.map((tenant) => (
                                    <TenantCard
                                        key={tenant.id}
                                        tenant={tenant}
                                        onDelete={handleDeleteTenant}
                                    />
                                ))}
                            </div>

                            {tenants.length === 0 && !showCreateForm && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No tenants found. Create your first tenant to get started.</p>
                                </div>
                            )}

                            {/* Create Tenant Form */}
                            {showCreateForm ? (
                                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Create New Tenant</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowCreateForm(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-tenant-name">Tenant Name</Label>
                                            <Input
                                                id="new-tenant-name"
                                                placeholder="e.g., Acme Corporation"
                                                value={tenantName}
                                                onChange={(e) => handleTenantNameChange(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-tenant-slug">Tenant Slug</Label>
                                            <Input
                                                id="new-tenant-slug"
                                                placeholder="e.g., acme-corporation"
                                                value={tenantSlug}
                                                onChange={(e) => setTenantSlug(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleCreateTenant}
                                            disabled={isLoading || !tenantName || !tenantSlug}
                                            className="w-full"
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Tenant
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateForm(true)}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Tenant
                                </Button>
                            )}
                        </>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
