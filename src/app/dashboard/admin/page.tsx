import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div>
        Welcome to admin {session?.user.username} {JSON.stringify(session)}
      </div>
    );
  }

  return <div>Please sign in to access admin area</div>;
};

export default page;
