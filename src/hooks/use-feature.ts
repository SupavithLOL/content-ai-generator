import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch planFature");
  return res.json();
};

interface PlanFeature {
  limitType: string;
  limitValue: string;
  description?: string;
}

interface PlanFeatureResponse {
  planFeature: PlanFeature[];
}

export const usePlanFeatures = () => {
  const { data, error, isLoading, mutate } = useSWR<PlanFeatureResponse>(
    "/api/subscription/plan-feature",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: false,
    }
  );

  return {
    planFeature: data?.planFeature || [],
    isLoading,
    error,
    mutatePlanFeature: mutate,
  };
};
