import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
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
      revalidateOnFocus: true,
      revalidateIfStale: false,
    }
  );

  return {
    subscription: data?.subscription || null,
    isLoading,
    error,
    mutateSubscription: mutate,
  };
};