//hooks/credit-history
import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch credit history");
  return res.json();
};

export const useCreditHistory = () => {
  const { data, isLoading } = useSWR("/api/credit/credit-history", fetcher);

  return {
    history: data?.history || [],
    isLoading: isLoading,
    refreshHistory: () => mutate("/api/credit/credit-history"),
  };
};
