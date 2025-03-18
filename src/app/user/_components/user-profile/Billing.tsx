import { getUserSubscription } from "@/lib/server/subscription";
import { getUserPlan } from "@/lib/server/plan";
import { getBillHistory } from "@/lib/server/bill-history";
import { getUserLatestPayment } from "@/lib/server/payment";
import CancelSubButton from "./CancelSubButton";

const Billing = async ({ userId }: { userId: string }) => {
  const [userPlan, userSubscription, userBillHistory, userLatestPayment] =
    await Promise.all([
      getUserPlan(userId),
      getUserSubscription(userId),
      getBillHistory(userId),
      getUserLatestPayment(userId),
    ]);

  const formatDate = (dateString: Date | string | undefined | null) => {
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
    <div className="w-full p-4 bg-white rounded-lg flex flex-col">
      <div className="w-full">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6 mb-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-left">Plan Details</h3>
              <p className="text-sm text-gray-500 text-left">
                {userPlan?.name || "N/A"} ({userPlan?.billingCycle || "N/A"})
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-left">Payment method</h3>
              <div className="flex items-center">
                <p className="text-gray-500 text-left">
                  {userLatestPayment?.method}
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
                {formatDate(userSubscription?.startDate)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-left">
                Next Billing Date
              </h3>
              <p className="text-gray-500 text-left">
                {formatDate(userSubscription?.endDate)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-left">
                Next Billing Amount
              </h3>
              <p className="text-gray-500 text-left">
                {userLatestPayment?.currency}
                {userLatestPayment?.amount}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-start space-x-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              upgrade Subcription
            </button>
            <CancelSubButton userId={userId} />
          </div>
        </div>
      </div>
      <div className="w-full border border-gray-200 mb-6 mt-6"></div>
      <div className="w-full">
        <div className="overflow-x-auto w-full">
          <div className="mb-4">
            <h1 className="font-semibold">Billing History</h1>
          </div>
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Plan Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Purchase Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  End Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment Method
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userBillHistory?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.planName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.purchaseDate)}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.endDate ? formatDate(item.endDate) : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.amount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
