import Link from "next/link";
import { HandMetal } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserSignOut from "./UserSignOut";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="bg-zinc-100 h-16 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between h-full">
        <Link href="/">
          <HandMetal />
        </Link>
        {session?.user ? (
          <UserSignOut user={session.user} />
        ) : (
          <Link
            className="md:p-4 py-2 block hover:text-blue-400 text-blue-500"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
