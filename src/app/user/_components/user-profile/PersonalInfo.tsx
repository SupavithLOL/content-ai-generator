"use client";

import { useSession } from "next-auth/react";

const PersonalInfo = ({}) => {
  const { data: session } = useSession();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <div className="mb-2">
        <p>Username</p>
        <p>{session?.user.username}</p>
      </div>
      <div className="mb-2">
        <p>E-mail</p>
        <p>{session?.user.email}</p>
      </div>
      <div className="mb-2">
        <p>Sign-up date:</p>
        <p>{formatDate(session?.user.createdAt)}</p>
      </div>
    </div>
  );
};

export default PersonalInfo;
