import { getCreditHistory, getUserCredit } from "@/lib/server/credit";
import { getPlanFeatures, getUserPlan } from "@/lib/server/plan";
import { getUserSubscription } from "@/lib/server/subscription";
import { LimitType } from "@prisma/client";

interface CreditHistoryItem {
  id: string;
  type: string;
  createdAt: Date;
  amount: number;
}

const PlanUsage = async ({ userId }: { userId: string }) => {
  const userCredit = await getUserCredit(userId);
  const userCreditHistory = await getCreditHistory(userId);
  const userPlan = await getUserPlan(userId);
  const userPlanFeature = await getPlanFeatures(userId);
  const userSubscription = await getUserSubscription(userId);

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
    <div className="w-full p-4 bg-white rounded-lg">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="flex flex-col mb-4">
          <div className="mb-4">
            <p>Current Plan</p>
            <p>
              {userPlan?.name}({userPlan?.billingCycle})
            </p>
          </div>
          <div className="mb-4">
            <p>Projects</p>
            <p>{userProjectLimit} in your plan</p>
          </div>
          <div className="mb-4">
            <p>Credits</p>
            <p>
              {userCredit?.credit}/{userCrediLimit}
            </p>
          </div>
          <div>
            <p>Expire Subscription Date</p>
            <p>{formatDate(userSubscription?.endDate)}</p>
          </div>
        </div>
        <div>
          {/* <CreditHistory /> */}
          <div className="w-full p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3>Recent credit usage</h3>
              <h3>Search</h3>
            </div>

            <div className="overflow-y-auto">
              <ul>
                {userCreditHistory.length > 0 ? (
                  userCreditHistory.map((item: CreditHistoryItem) => (
                    <li key={item.id} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
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
                  <p className="text-gray-500">ยังไม่มีประวัติการใช้เครดิต.</p>
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
