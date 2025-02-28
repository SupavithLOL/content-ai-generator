import Navbar from "@/app/user/_components/Navbar";
import Sidebar from "./_components/Sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex item-center justify-center">
      {/* <Sidebar /> */}
      <Navbar />
      {children}
    </div>
  );
};

export default UserLayout;
