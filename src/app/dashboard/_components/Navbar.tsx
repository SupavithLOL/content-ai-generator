"use client";

import UserSignOut from "@/components/UserSignOut";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminNavbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="bg-zinc-100 h-16 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between h-full">
        <Link href="/">Icon</Link>
        {session ? (
          (console.log(session.user), (<UserSignOut user={session.user} />))
        ) : (
          <Link
            className="md:p-4 py-2 block hover:text-blue-400 text-blue-500"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
