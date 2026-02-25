import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useTenants } from '@/hooks/queries/use-tenants';
import { Select } from '@/components/ui/Select';
import { Loader2, ShieldCheck } from 'lucide-react';

export function TenantSelector() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const { tenants, isLoading } = useTenants();

    // Current tenant from user object
    const currentTenantId = user?.tenant_id || "";

    // Resolve the active tenant object
    const activeTenant = tenants?.find(t => t.id === currentTenantId)
        || tenants?.find(t => t.is_active)
        || tenants?.[0];

    // Auto-select a tenant if none is set or invalid
    useEffect(() => {
        if (!isLoading && tenants && tenants.length > 0 && user) {
            const isValid = tenants.find(t => t.id === currentTenantId);

            if (!currentTenantId || !isValid) {
                const fallback = tenants.find(t => t.is_active) || tenants[0];
                console.log("TenantSelector: Auto-selecting tenant:", fallback.id);
                updateUser({ ...user, tenant_id: fallback.id });
            }
        }
    }, [isLoading, tenants, currentTenantId, user, updateUser]);

    // Handle tenant change
    const onTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "__manage__") {
            navigate('/settings');
            e.target.value = activeTenant?.id || "";
            return;
        }

        if (value === currentTenantId) return;

        if (user) {
            console.log("TenantSelector: Switching to tenant:", value);
            updateUser({ ...user, tenant_id: value });
        }
    };

    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;

    // If no tenants exist at all, don't render
    if (!tenants || tenants.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <div className="flex items-center gap-1.5">
                {/* Active status dot */}
                <span className="relative flex h-2 w-2">
                    {activeTenant?.is_active !== false && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${activeTenant?.is_active !== false ? 'bg-blue-500' : 'bg-muted-foreground'}`}></span>
                </span>
                <Select
                    key={activeTenant?.id || "empty"}
                    value={activeTenant?.id || ""}
                    onChange={onTenantChange}
                    disabled={isLoading}
                    className="h-8 w-auto min-w-[120px] max-w-[180px] text-xs font-medium bg-transparent border-border/50 hover:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/20"
                >
                    {!activeTenant && <option value="" disabled>Select Tenant</option>}
                    {tenants?.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                            {tenant.name}
                        </option>
                    ))}
                    <option disabled>──────────</option>
                    <option value="__manage__">⚙ Manage Tenants</option>
                </Select>
            </div>
        </div>
    );
}
