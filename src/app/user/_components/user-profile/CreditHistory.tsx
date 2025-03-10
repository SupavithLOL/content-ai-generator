"use client";

import { useCreditHistory } from "@/hooks/credit-history";

const CreditHistory = () => {
  const { history, isLoading } = useCreditHistory(); // รับ isLoading มาด้วย

  if (isLoading) {
    return (
      <div className="w-full p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Credit History</h3>
        <p className="text-sm text-gray-500 mb-4">
          กำลังโหลดประวัติการใช้เครดิต...
        </p>
        {/* อาจจะเพิ่ม Loading Spinner หรือ Placeholder UI ที่นี่ */}
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3>Recent credit usage</h3>
        <h3>Search</h3>
      </div>

      <div className="overflow-y-auto">
        <ul>
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
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
  );
};

export default CreditHistory;
