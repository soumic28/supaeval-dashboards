import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/jobs";
import { resultService } from "@/services/results";

export function useJobs() {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ["jobs"],
    queryFn: jobService.getAll,
    refetchInterval: 10000, // Poll every 10s for updates
  });

  const runOnlineJobMutation = useMutation({
    mutationFn: jobService.runOnline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  return {
    jobs: jobsQuery.data,
    isLoading: jobsQuery.isLoading,
    runOnlineJob: runOnlineJobMutation.mutate,
  };
}

export function useJobResults(jobId: string) {
  return useQuery({
    queryKey: ["job-results", jobId],
    queryFn: () => resultService.getByJob(jobId),
    enabled: !!jobId,
  });
}

export function useResultsSummary() {
  return useQuery({
    queryKey: ["results-summary"],
    queryFn: resultService.getSummary,
  });
}
