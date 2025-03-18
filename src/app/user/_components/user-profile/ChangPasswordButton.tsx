"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast, Slide } from "react-toastify";

const ChangPasswordButton = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      const errorData = await response.json();

      if (!response.ok) {
        throw new Error(
          errorData.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
        );
      }

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setOpen(false); // ปิด Modal หลังจากเปลี่ยนรหัสผ่านสำเร็จ
      setNewPassword(""); // ล้างค่า input
      setConfirmPassword(""); // ล้างค่า input
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">เปลี่ยนรหัสผ่าน</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
          <DialogDescription>
            กรุณากรอกรหัสผ่านใหม่ที่คุณต้องการใช้
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              รหัสผ่านใหม่
            </Label>
            <Input
              id="newPassword"
              type="password"
              className="col-span-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">
              ยืนยันรหัสผ่านใหม่
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="col-span-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? <>กำลังเปลี่ยน...</> : "เปลี่ยนรหัสผ่าน"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
};

export default ChangPasswordButton;
