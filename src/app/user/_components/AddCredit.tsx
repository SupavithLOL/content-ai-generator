"use client";
import { useCredit } from "@/hooks/credit";
import { useCreditHistory } from "@/hooks/credit-history";

interface GenerateButtonProps {
  amount: number;
  type: string;
}

const AddCredit = ({ amount, type }: GenerateButtonProps) => {
  const { refreshCredit } = useCredit();
  const { refreshHistory } = useCreditHistory();
  const handleAddCredit = async () => {
    try {
      const res = await fetch("/api/credit/add-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error);
        return;
      }

      const responseData = await res.json();

      refreshCredit();
      refreshHistory();
    } catch (error) {
      console.error("Error using credit:", error);
      alert("เพิ่มเครดิตไม่สำเร็จ: ");
    }
  };

  return (
    <div>
      <button
        className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-black font-semibold"
        onClick={handleAddCredit}
      >
        Add Credit
      </button>
    </div>
  );
};

export default AddCredit;
