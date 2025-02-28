import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch credit");
  return res.json();
};

export const useCredit = () => {
  const { data } = useSWR("/api/credit", fetcher);

  return {
    credit: data?.credit || 0,
    refreshCredit: () => mutate("/api/credit"),
  };
};
