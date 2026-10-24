import { Link, NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useState } from "react";
import { capitalize } from "@/utils/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getDate } from "@/utils/utils";

const NavBar = () => {
  const { logout, userData } = useAuth();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const initials = `${userData?.firstName?.charAt(0).toUpperCase()}${userData?.lastName?.charAt(0).toUpperCase()}`;

  return (
    <div>
      <div className="redbg h-8 w-full flex justify-between px-4 md:px-16 items-center">
      <div className="text-white/90 text-xs">Personal Banking</div>
      <div className="text-white/90 text-xs">{getDate()}</div>
      </div>
      <div className={`px-2 py-2 md:px-16 py-4 ${styles.NavBar}`}>
        <Link to="/">
          <div className="no-mobile py-[2px]hover:opacity-60">
            <div className={styles.logo}>Bank of CLI</div>
          </div>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<NavLink to="/" />}>
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<NavLink to="/history" />}>
                Statements
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Transaction</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink render={<NavLink to="/transaction/deposit" />}>Deposit</NavigationMenuLink>
                <NavigationMenuLink render={<NavLink to="/transaction/withdrawal" />}>Withdrawal</NavigationMenuLink>
                <NavigationMenuLink render={<NavLink to="/transaction/transfer" />}>Transfer</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="no-mobile">
                  <div className="font-bold text-left text-xs">
                    {`${userData && capitalize(userData.firstName)} ${userData?.lastName?.charAt(0).toUpperCase()}.`}
                  </div>
                  <div className="text-xs opacity-60">Personal Account</div>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Settings</NavigationMenuLink>
                <NavigationMenuLink render={<button type="button" />} onClick={() => setSignOutOpen(true)}>
                  Sign Out
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Dialog lives outside the menu, so closing the menu doesn't unmount it */}
        <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={logout}>
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default NavBar;
