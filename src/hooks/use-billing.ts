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

interface UserInBillingHistory { 
    username: string;
  }
  
  interface PlanInBillingHistory {
    name: string;
  }
  
  interface BillingHistory {
    id: string;
    userId: string;
    user: UserInBillingHistory; 
    planName: string;
    plan: PlanInBillingHistory;
    purchaseDate: string;
    endDate: string | null;
    amount: number;
    paymentMethod: string;
    billingCycle: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    subscriptionId: string | null; 
  }

interface BillingHistoryResponse {
    billingHistory: BillingHistory[];
}

export const useBillingHistory = () => {
    const { data, error, isLoading, mutate } = useSWR<BillingHistoryResponse>(
      "/api/subscription/billing-history",
      fetcher,
      {
        revalidateOnFocus: false,  // ไม่โหลดใหม่ทุกครั้งที่สลับแท็บ
      revalidateIfStale: true,   // โหลดใหม่เมื่อข้อมูลเก่า
      refreshInterval: 60000,
      }
    );
  
    return {
      billingHistory: data?.billingHistory || [],
      isLoading,
      error,
      mutateBillingHistory: mutate,
    };
  };