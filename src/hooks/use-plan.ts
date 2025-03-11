import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
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
      revalidateOnFocus: false,  // ไม่โหลดใหม่ทุกครั้งที่สลับแท็บ
      revalidateIfStale: true,   // โหลดใหม่เมื่อข้อมูลเก่า
      refreshInterval: 60000,
    }
  );

  return {
    plan: data?.plan || null,
    isLoading,
    error,
    mutatePlan: mutate,
  };
};