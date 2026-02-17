import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { workspaceService } from "@/services/workspaces";

export function useWorkspaceActions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshProfile, updateUser, user } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const switchWorkspace = async (workspaceId: string) => {
    setIsSwitching(true);
    try {
      console.log(`useWorkspaceActions: Switching to ${workspaceId}`);
      const response = (await workspaceService.switchWorkspace(
        workspaceId,
      )) as any;
      console.log("useWorkspaceActions: Switch SUCCESS response:", response);

      // 1. Handle Token Update
      let newToken = response?.access_token || response?.token;
      if (newToken) {
        console.log("useWorkspaceActions: Updating token from response");
        localStorage.setItem("auth_token", newToken);

        // Wait a bit for storage propagation/state stability
        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log("useWorkspaceActions: Refreshing profile...");
        await refreshProfile();
      } else {
        console.warn("useWorkspaceActions: No new token returned.");
      }

      // 2. Force Update User State
      if (user) {
        const finalWorkspaceId = response?.workspace_id || workspaceId;
        const updatedUser = { ...user, workspace_id: finalWorkspaceId };
        // Persist to storage just in case
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        console.log("useWorkspaceActions: updating user state:", updatedUser);
        updateUser(updatedUser);
      }

      // 3. Query Invalidation & Navigation
      console.log("useWorkspaceActions: Invalidating queries...");
      await queryClient.cancelQueries();
      queryClient.clear();
      await queryClient.invalidateQueries();

      // Navigate home to force re-render of layout/dashboard with new context
      navigate("/");

      return true;
    } catch (error) {
      console.error("useWorkspaceActions: Failed to switch workspace", error);
      return false;
    } finally {
      setIsSwitching(false);
    }
  };

  return {
    switchWorkspace,
    isSwitching,
  };
}
