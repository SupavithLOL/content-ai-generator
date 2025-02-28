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
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="flex flex-col-2 justify-center item-center">
        <UserInfo user={session.user} />
        <Credits />
      </div>

      <CreditHistory />
    </div>
  );
};

export default UserProfilePage;
