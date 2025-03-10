import { useBillingHistory } from "@/hooks/use-billing";

const BillingHistoryTable = () => {
  const { billingHistory, isLoading, error } = useBillingHistory();

  // src/lib/utils.js หรือไฟล์ utility อื่นๆ
  const formatDate = (dateString) => {
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

  if (isLoading) {
    return <p>กำลังโหลดประวัติการ Billing...</p>;
  }

  if (error) {
    return <p>เกิดข้อผิดพลาดในการโหลดประวัติการ Billing: {error.message}</p>;
  }

  return (
    <div className="overflow-x-auto w-full">
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
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {billingHistory?.map((item) => (
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BillingHistory = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="font-semibold">Billing History</h1>
      </div>
      <BillingHistoryTable />
    </div>
  );
};

export default BillingHistory;
