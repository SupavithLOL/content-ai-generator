import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch credit");
  return res.json();
};

export const useCredit = () => {
  const { data, error, isLoading } = useSWR("/api/credit", fetcher,{
    revalidateOnFocus: false,  // ไม่โหลดใหม่ทุกครั้งที่สลับแท็บ
      revalidateIfStale: true,   // โหลดใหม่เมื่อข้อมูลเก่า
      refreshInterval: 60000,
  });

  return {
    credit: data?.credit || 0,
    isLoading,
    error,
    refreshCredit: () => mutate("/api/credit"),
  };
};
