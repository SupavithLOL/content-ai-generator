import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
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
      revalidateOnFocus: false,  // ไม่โหลดใหม่ทุกครั้งที่สลับแท็บ
      revalidateIfStale: true,   // โหลดใหม่เมื่อข้อมูลเก่า
      refreshInterval: 60000,
    }
  );

  return {
    planFeature: data?.planFeature || [],
    isLoading,
    error,
    mutatePlanFeature: mutate,
  };
};
