import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SettingPage = async () => {
  //พวกหน้า setting หรือหน้าต่างๆควรใช้ getServerSession(authOptions) เป็นการทำงานของฝั่ง server
  const session = await getServerSession(authOptions);
  //   const session = useCurrentUser();
  return <div>{JSON.stringify(session)}</div>;
};

export default SettingPage;
