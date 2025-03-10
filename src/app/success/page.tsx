"use client"; // Mark this component as a Client Component

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/use-subscription";
import { usePlan } from "@/hooks/use-plan";
import { usePlanFeatures } from "@/hooks/use-feature";
import { useBillingHistory } from "@/hooks/use-billing";

const SuccessPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { mutateSubscription } = useSubscription();
  const { mutatePlan } = usePlan();
  const { mutatePlanFeature } = usePlanFeatures();
  const { mutateBillingHistory } = useBillingHistory();

  useEffect(() => {
    if (status === "loading") {
      return; // รอ session โหลดเสร็จ
    }
    if (status === "unauthenticated") {
      router.push("/auth/sign-in"); // Use router.push from next/navigation
    }
    mutateSubscription();
    mutatePlan(); // Trigger manual revalidation
    mutatePlanFeature();
    mutateBillingHistory();
  }, [
    status,
    router,
    mutateSubscription,
    mutatePlan,
    mutatePlanFeature,
    mutateBillingHistory,
  ]);

  if (status !== "authenticated") {
    return null; // Or loading state
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-green-700">
                Payment Successful! 🎉
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>
                  Thank you for your purchase! Your payment has been processed
                  successfully.
                </p>
                <p>
                  An email confirmation has been sent to:{" "}
                  <span className="font-semibold text-green-600">
                    {session?.user?.email}
                  </span>
                </p>
              </div>
              <div className="pt-6 text-base font-semibold leading-6 sm:text-lg sm:leading-7">
                <p>
                  <Link
                    href="/user/profile"
                    className="text-green-600 hover:text-green-800"
                  >
                    Go to your Profile →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
