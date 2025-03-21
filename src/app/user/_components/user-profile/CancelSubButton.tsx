"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ToastContainer, toast, Slide } from "react-toastify";

const CancelSubButton = ({ userId }: { userId: string }) => {
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
        setIsCanceling(false);
        return;
      }

      toast.success("Subscription cancelled successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setIsCanceling(false);
      window.location.reload();
    } catch (error) {
      console.error("Error during subscription cancellation:", error);
      setIsCanceling(false);
    }
  };

  return (
    <div className="justify-center items-center">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="text-red-500 hover:text-red-600 text-sm font-semibold focus:outline-none"
            disabled={isCanceling} // Disable button while canceling
          >
            Cancel subcription
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการยกเลิก Subscription</DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการยกเลิก Subscription? การยกเลิกจะมีผลทันที
              และคุณจะไม่สามารถเข้าถึง Features ของ Plan นี้ได้อีกต่อไป
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:text-secondary-foreground h-10 px-4 py-2"
              >
                ยกเลิก
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isCanceling ? "กำลังยกเลิก..." : "ยืนยันการยกเลิก"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default CancelSubButton;
