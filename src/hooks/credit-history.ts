//hooks/credit-history
import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch credit history");
  return res.json();
};

export const useCreditHistory = () => {
  const { data, error, isLoading } = useSWR("/api/credit/credit-history", fetcher,{
    revalidateOnFocus: false,  // ไม่โหลดใหม่ทุกครั้งที่สลับแท็บ
      revalidateIfStale: true,   // โหลดใหม่เมื่อข้อมูลเก่า
      refreshInterval: 60000,
  });

  return {
    history: data?.history || [],
    isLoading: isLoading,
    error,
    refreshHistory: () => mutate("/api/credit/credit-history"),
  };
};
