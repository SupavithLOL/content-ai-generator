import SignInForm from "@/components/auth/SignInForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/user");
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
