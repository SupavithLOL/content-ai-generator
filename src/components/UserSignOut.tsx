"use client";

import { signOut } from "next-auth/react";

interface UserSignOutProps {
  user: {
    username?: string | null;
    email?: string | null;
  };
}

const UserSignOut: React.FC<UserSignOutProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">{user.username || user.email}</span>
      <button
        onClick={() =>
          signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`,
          })
        }
        className="md:p-4 py-2 block hover:text-red-400 text-red-500"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserSignOut;
