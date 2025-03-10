"use client";

import { FaLock } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { useSubscriptionStatus } from "@/hooks/use-subscription";

interface UserInfoProps {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

const UserInfo = ({ user }: UserInfoProps) => {
  const {
    subscription,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    // mutateSubscription,
  } = useSubscriptionStatus();

  if (isSubscriptionLoading) {
    return <p>Loading profile and subscription...</p>;
  }

  if (subscriptionError) {
    return <p>Error loading subscription: {subscriptionError.message}</p>;
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Personal Information
        </h1>
        <p className="text-sm text-gray-500">
          Manage your profile details and settings
        </p>
      </div>
      <div className="mb-4">
        <p className="font-semibold text-gray-700">Username</p>
        <p className="text-gray-900">{user.username}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold text-gray-700">Email</p>
        <p className="text-gray-900">{user.email}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold text-gray-700">Subscription</p>
        {subscription ? (
          <div>
            <p className="text-gray-900">Plan: {subscription?.plan.name}</p>
            <p>Status: {subscription.status}</p>
          </div>
        ) : (
          <p className="text-gray-900">
            No Subscription{" "}
            <Link className="text-red-500" href="/pricing">
              Click here
            </Link>
          </p>
        )}
      </div>
      <div className="mt-6 flex space-x-2">
        <button className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
          <FaEdit className="mr-2 h-4 w-4" />
          Change Name
        </button>
        <button className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
          <FaLock className="mr-2 h-4 w-4" />
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
