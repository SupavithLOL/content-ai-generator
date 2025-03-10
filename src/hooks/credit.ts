import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch credit");
  return res.json();
};

export const useCredit = () => {
  const { data, error, isLoading } = useSWR("/api/credit", fetcher,{
    revalidateOnFocus: true,
    revalidateIfStale: false,
    revalidateInterval: 30000, 
  });

  return {
    credit: data?.credit || 0,
    isLoading,
    error,
    refreshCredit: () => mutate("/api/credit"),
  };
};
