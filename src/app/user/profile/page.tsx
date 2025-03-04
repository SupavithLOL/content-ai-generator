import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserInfo from "../_components/UserInfo";
import Credits from "../_components/Credits";
import CreditHistory from "../_components/CreditHistory";

const UserProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="w-full p-6 md:p-10 jutify-center item-center">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <UserInfo user={session.user} />
        </div>
        <div className="col-span-1">
          <Credits />
        </div>
      </div>

      <div className="mb-8">
        <CreditHistory />
      </div>
    </div>
  );
};

export default UserProfilePage;
