import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch plan");
  return res.json();
};
interface Plan {
  id: string;
  name: string;
  description: string;
  billingCycle: string;  
}

interface PlanResponse {
    plan: Plan | null;
}

export const usePlan = () => {
  const { data, error, isLoading, mutate } = useSWR<PlanResponse>(
    '/api/subscription/plan',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: false,
    }
  );

  return {
    plan: data?.plan || null,
    isLoading,
    error,
    mutatePlan: mutate,
  };
};