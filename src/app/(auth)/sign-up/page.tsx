import SignUpForm from "@/components/auth/SignUpForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/user");
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
