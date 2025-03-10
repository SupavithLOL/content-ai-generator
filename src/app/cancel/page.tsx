"use client"; // Mark this component as a Client Component

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

const CancelPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // Use useRouter from next/navigation

  useEffect(() => {
    if (status === "loading") {
      return; // รอ session โหลดเสร็จ
    }
    if (status === "unauthenticated") {
      router.push("/auth/sign-in"); // Use router.push from next/navigation
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return null; // Or loading state
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-red-300 to-red-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-red-700">
                Payment Cancelled
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>It seems like you have cancelled your payment.</p>
                <p>If you have any questions, please contact support.</p>
                <p>
                  Your account email is:{" "}
                  <span className="font-semibold text-red-600">
                    {session?.user?.email}
                  </span>
                </p>
              </div>
              <div className="pt-6 text-base font-semibold leading-6 sm:text-lg sm:leading-7">
                <p>
                  <Link
                    href="/profile"
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

export default CancelPage;
