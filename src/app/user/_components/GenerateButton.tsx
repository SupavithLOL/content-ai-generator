"use client";
import { useCredit } from "@/hooks/credit";
import { useCreditHistory } from "@/hooks/credit-history";
import { useState } from "react";

interface GenerateButtonProps {
  amount: number;
  type: string;
}

//รับ prop ของ prompt และข้อมูลต่างๆที่กรอก และส่งให้ ai คำนวณ
//เช่น {prompt: string}, {lanaguage}

const GenerateButton = ({ amount, type }: GenerateButtonProps) => {
  const { refreshCredit } = useCredit();
  const { refreshHistory } = useCreditHistory();
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    try {
      const res = await fetch("/api/credit/use-credit", {
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
      alert("ใช้เครดิตไม่สำเร็จ: ");
    }
  };

  // const handleGenerate = async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   setGeneratedText("");

  //   // 1️⃣ ส่งคำขอไปที่ AI Model (ยังไม่หักเครดิต)
  //   const aiRes = await fetch("/api/generate-ai", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ prompt: {prompt} }),
  //   });

  //   if (!aiRes.ok) {
  //     alert("เกิดข้อผิดพลาดในการสร้าง AI");
  //     setLoading(false);
  //     return;
  //   }
  //   const { text } = await aiRes.json();
  //   setGeneratedText(text); // แสดงผล AI ที่สร้างได้

  //   // 3️⃣ ส่ง text ไปคำนวณใน api useCredit เพื่อหัก credit
  //   const creditRes = await fetch("/api/credit/use-credit", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ text }),
  //   });

  //   if (!creditRes.ok) {
  //     alert("เครดิตไม่เพียงพอ หรือมีข้อผิดพลาด");
  //     setLoading(false);
  //     return;
  //   }

  //   // ✅ อัปเดต credit และ history บน UI
  //   refreshCredit();
  //    refreshHistory();
  //   setLoading(false);
  // };

  return (
    <div>
      <button
        className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-black font-semibold"
        onClick={handleGenerate}
      >
        Use Credit
      </button>
    </div>
  );
};

export default GenerateButton;
