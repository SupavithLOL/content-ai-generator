import { usePlan } from "@/hooks/use-plan";
import { useSubscription } from "@/hooks/use-subscription";

const SubscriptionDetail = () => {
  const { subscription } = useSubscription();
  const { plan } = usePlan();
  const formatDate = (dateString: Date | string | undefined) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6 mb-4 text-sm">
        <div>
          <h3 className="font-semibold mb-2 text-left">Plan Details</h3>
          <p className="text-sm text-gray-500 text-left">
            {plan?.name} ({plan?.billingCycle})
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-left">Payment method</h3>
          <div className="flex items-center">
            <p className="text-gray-500 text-left">
              Card
              {/* <span className="text-indigo-600 ml-1 cursor-pointer">
                change
              </span> */}
            </p>
          </div>
        </div>
        <div>
          {/* Div ว่างนี้ใช้เพื่อให้โครงสร้าง grid 3 คอลัมน์สมบูรณ์และจัดวางข้อมูลแถว 1 และ 2 ให้ตรงกัน */}
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div>
          <h3 className="font-semibold mb-1 text-left">Start Date</h3>
          <p className="text-gray-500 text-left">
            {formatDate(subscription?.startDate)}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-left">Next Billing Date</h3>
          <p className="text-gray-500 text-left">endPeriod</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-left">Next Billing Amount</h3>
          <p className="text-gray-500 text-left">$200</p>
        </div>
      </div>

      <div className="mt-6 flex justify-start space-x-4">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          upgrade Subcription
        </button>
        <button className="text-red-500 hover:text-red-600 text-sm font-semibold focus:outline-none">
          Cancel subcription
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDetail;
