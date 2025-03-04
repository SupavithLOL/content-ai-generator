"use client";
import CardWrapper from "@/components/auth/CardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const NewVerificationForm = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const onSubmit = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/new-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setStatus("success");
        toast.success("Email verified successfully! You can now sign in.");
      } else {
        setStatus("error");
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to verify email.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      toast.error("An unexpected error occurred during verification.");
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirm your verification"
      backButtonLabel="Back to login"
      backButtonHref="/sign-in"
    >
      <div className="flex items-center w-full justify-center">
        {status === "idle" && <p>Checking verification token...</p>}
        {status === "loading" && (
          <div className="flex items-center space-x-2">
            <BeatLoader size={10} color="#212121" />
            <p className="text-center text-gray-600">
              Verifying your email address...
            </p>
          </div>
        )}
        {status === "success" && (
          <div>
            <p className="text-green-500 font-semibold text-center">
              Email has been verified!
            </p>
          </div>
        )}
        {status === "error" && (
          <div>
            <p className="text-red-500 font-semibold text-center">
              Email verification failed.
            </p>
            <p className="text-center text-gray-600">
              Please ensure you are using a valid verification link. If the
              problem persists, you may request a new verification email.
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </CardWrapper>
  );
};

export default NewVerificationForm;
