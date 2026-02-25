import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/tenants";
import type { Tenant } from "@/types/models";

export function useTenants() {
  const queryClient = useQueryClient();

  const tenantsQuery = useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: () => tenantService.getAll(),
  });

  const createTenantMutation = useMutation({
    mutationFn: tenantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  return {
    tenants: tenantsQuery.data as Tenant[] | undefined,
    isLoading: tenantsQuery.isLoading,
    createTenant: createTenantMutation.mutate,
    isCreating: createTenantMutation.isPending,
  };
}
