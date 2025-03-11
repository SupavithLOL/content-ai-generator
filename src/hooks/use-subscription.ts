import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
};
interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  status: string;
  startDate: string;
  endDate: string;     
}

interface SubscriptionResponse {
  subscription: Subscription | null;
}

export const useSubscription = () => {
  const { data, error, isLoading, mutate } = useSWR<SubscriptionResponse>(
    '/api/subscription/subscription-status',
    fetcher,
    {
      revalidateOnFocus: false,  // ไม่โหลดใหม่ทุกครั้งที่สลับแท็บ
      revalidateIfStale: true,   // โหลดใหม่เมื่อข้อมูลเก่า
      refreshInterval: 60000,
    }
  );

  return {
    subscription: data?.subscription || null,
    isLoading,
    error,
    mutateSubscription: mutate,
  };
};