"use client";

import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

interface SidebarProps {
  isMobile?: boolean;
}

const UserSidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const pathname = usePathname();
  const navLinks = [
    { href: "/user/project", icon: Home, label: "Project" },
    { href: "#", icon: ShoppingCart, label: "Orders" },
    { href: "#", icon: Package, label: "Products" },
    { href: "#", icon: Users, label: "Customers" },
    { href: "/user/profile", icon: LineChart, label: "Profile" },
  ];

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">AI Generate</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary
                ${pathname === link.href ? "bg-muted text-primary" : ""}
              `}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        {/* <Card>
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>
              Unlock all features and get unlimited access to our support team.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <Button size="sm" className="w-full">
              Upgrade
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        sidebarContent
      ) : (
        <aside className="hidden border-r bg-muted/40 md:block">
          {sidebarContent}
        </aside>
      )}
    </>
  );
};

export default UserSidebar;
