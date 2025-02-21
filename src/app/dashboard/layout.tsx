import Navbar from "@/components/Navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex item-center justify-center">
      <Navbar />
      {children}
    </div>
  );
};

export default AdminLayout;
