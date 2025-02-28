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
    <div className="w-full p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Credit History</h3>
      <p className="text-sm text-gray-500 mb-4">Recent credit usage</p>

      <div className="max-h-[300px] overflow-y-auto">
        <ul className="space-y-4">
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-semibold">
                      {item.amount} Credits
                    </p>
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
