"use client";

import BillingHistory from "./BillingHistory";
import SubscriptionDetail from "./SubscriptionDetail";

const Billing = () => {
  return (
    <div className="w-full p-4 bg-white rounded-lg flex flex-col">
      <div className="w-full">
        <SubscriptionDetail />
      </div>
      <div className="w-full border border-gray-200 mb-6 mt-6"></div>
      <div className="w-full">
        <BillingHistory />
      </div>
    </div>
  );
};

export default Billing;
