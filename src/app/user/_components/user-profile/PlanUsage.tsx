import { getCreditHistory, getUserCredit } from "@/lib/server/credit";
import { getPlanFeatures, getUserPlan } from "@/lib/server/plan";
import { getUserSubscription } from "@/lib/server/subscription";
import { LimitType } from "@prisma/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Import icon

interface CreditHistoryItem {
  id: string;
  type: string;
  createdAt: Date;
  amount: number;
}

const PlanUsage = async ({ userId }: { userId: string }) => {
  const [
    userCredit,
    userCreditHistory,
    userPlan,
    userPlanFeature,
    userSubscription,
  ] = await Promise.all([
    getUserCredit(userId),
    getCreditHistory(userId),
    getUserPlan(userId),
    getPlanFeatures(userId),
    getUserSubscription(userId),
  ]);

  const creditLimitFeature = userPlanFeature?.find(
    (feature) => feature.limitType === LimitType.CREDIT_LIMIT
  );
  const userCrediLimit = creditLimitFeature?.limitValue;

  const projectLimitFeature = userPlanFeature?.find(
    (feature) => feature.limitType === LimitType.PROJECTS
  );
  const userProjectLimit = projectLimitFeature?.limitValue;

  const formatDate = (dateString: Date | string | null | undefined) => {
    if (!dateString || dateString === null || dateString === undefined) {
      return "N/A";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <div className="flex flex-col space-y-4">
          <div className="mb-2">
            <p className="text-lg font-semibold text-gray-800">Current Plan</p>
            <p className="text-gray-600">
              {userPlan?.name || "N/A"} ({userPlan?.billingCycle || "N/A"})
            </p>
          </div>
          <div className="mb-2">
            <p className="text-lg font-semibold text-gray-800">Projects</p>
            <p className="text-gray-600">
              {userProjectLimit || "N/A"} in your plan
            </p>
          </div>
          <div className="mb-2">
            <p className="text-lg font-semibold text-gray-800">Credits</p>
            <p className="text-gray-600">
              {userCredit?.credit || 0}/{userCrediLimit || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">Subscription</p>
            {userSubscription ? (
              <p className="text-gray-600">
                Expires: {formatDate(userSubscription?.endDate)}
              </p>
            ) : (
              <p className="text-gray-600 italic text-gray-500">
                No active subscription
              </p>
            )}
          </div>
        </div>
        <div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Credit Usage
              </h3>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              <ul className="divide-y divide-gray-200">
                {userCreditHistory.length > 0 ? (
                  userCreditHistory.map((item: CreditHistoryItem) => (
                    <li key={item.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-700">
                            {item.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </p>
                          {item.amount < 0 ? (
                            <p className="text-red-500 font-semibold">
                              {item.amount}
                            </p>
                          ) : (
                            <p className="text-green-500 font-semibold">
                              +{item.amount}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500 italic">
                    No credit history available.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanUsage;
