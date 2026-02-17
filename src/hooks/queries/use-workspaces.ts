import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspaces";
import { userService } from "@/services/users";

export function useWorkspaces() {
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.getAll,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: workspaceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  return {
    workspaces: workspacesQuery.data,
    isLoading: workspacesQuery.isLoading,
    createWorkspace: createWorkspaceMutation.mutate,
    isCreating: createWorkspaceMutation.isPending,
  };
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      workspaceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

// Switch workspace mutation (simplified, logic remains in component for now or moved here if we inject auth)
export function useSwitchWorkspace() {
  return useMutation({
    mutationFn: (id: string) => workspaceService.switchWorkspace(id),
  });
}

export function useTestUsers(workspaceId: string) {
  const queryClient = useQueryClient();

  const testUsersQuery = useQuery({
    queryKey: ["test-users", workspaceId],
    queryFn: () => userService.getTestUsers(workspaceId),
    enabled: !!workspaceId,
  });

  const createTestUserMutation = useMutation({
    mutationFn: (data: any) => userService.createTestUser(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-users", workspaceId] });
    },
  });

  return {
    testUsers: testUsersQuery.data,
    isLoading: testUsersQuery.isLoading,
    createTestUser: createTestUserMutation.mutate,
  };
}
