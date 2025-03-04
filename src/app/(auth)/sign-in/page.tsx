"use client";

import SignInForm from "@/components/auth/SignInForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SignInPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/user");
    }
  }, [session, router]);

  return (
    <div className="w-full">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
