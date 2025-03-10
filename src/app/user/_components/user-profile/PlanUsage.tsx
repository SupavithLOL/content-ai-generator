"use client";

import { useCredit } from "@/hooks/credit";
import { usePlanFeatures } from "@/hooks/use-feature";
import { usePlan } from "@/hooks/use-plan";
import { useSubscription } from "@/hooks/use-subscription";
import { LimitType } from "@prisma/client";
import CreditHistory from "./CreditHistory";

const PlanUsage = () => {
  const { plan } = usePlan();
  const { planFeature } = usePlanFeatures();
  const { subscription } = useSubscription();
  const { credit } = useCredit();

  const getFeatureValue = (limitType: LimitType): string | undefined => {
    const feature = planFeature?.find((feat) => feat.limitType === limitType);
    return feature?.limitValue; // Return limitValue if found, undefined otherwise
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US");
  };

  const projectLimit = getFeatureValue(LimitType.PROJECTS);
  const creditLimit = getFeatureValue(LimitType.CREDIT_LIMIT);

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="flex flex-col mb-4">
          <div className="mb-4">
            <p>Current Plan</p>
            <p>
              {plan?.name}({plan?.billingCycle})
            </p>
          </div>
          <div className="mb-4">
            <p>Projects</p>
            <p>{projectLimit} in your plan</p>
          </div>
          <div className="mb-4">
            <p>Credits</p>
            <p>
              {credit}/{creditLimit}
            </p>
          </div>
          <div>
            <p>Expire Subscription Date</p>
            <p>{formatDate(subscription?.endDate)}</p>
          </div>
        </div>
        <div>
          <CreditHistory />
        </div>
      </div>
    </div>
  );
};

export default PlanUsage;
