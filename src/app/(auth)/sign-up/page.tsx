"use client";

import SignUpForm from "@/components/auth/SignUpForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SignUpPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/user");
    }
  }, [session, router]);

  return (
    <div className="w-full">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
