import AdminNavbar from "./_components/Navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex item-center justify-center">
      <AdminNavbar />
      {children}
    </div>
  );
};

export default AdminLayout;
