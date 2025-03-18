import { Session } from "next-auth";
import ChangPasswordButton from "./ChangPasswordButton";

interface PersonalInfoProps {
  session: Session | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ session }) => {
  const formatDate = (dateString: Date | string | undefined) => {
    if (!dateString) {
      return "N/A";
    }

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
      <div>
        <ChangPasswordButton userId={session?.user?.id ?? ""} />
      </div>
    </div>
  );
};

export default PersonalInfo;
