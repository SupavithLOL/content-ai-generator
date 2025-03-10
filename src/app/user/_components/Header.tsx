import { CircleUser, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isMobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { data: session } = useSession();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <DialogTitle>เมนูนำทาง</DialogTitle>
          <Sidebar isMobile={true} />
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/user/profile">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: `${window.location.origin}/sign-in`,
                })
              }
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>{session?.user?.username}</div>
      </div>
    </header>
  );
};

export default Header;
