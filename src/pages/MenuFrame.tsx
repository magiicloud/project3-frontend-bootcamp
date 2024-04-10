import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Building,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { useUser } from "../components/UserContext";

const Menubar = () => {
  return (
    <>
      <NavLink
        to="dashboard"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? "bg-muted text-primary" : "text-muted-foreground"
          }`
        }
      >
        <Home className="h-5 w-5" />
        Dashboard
      </NavLink>
      <NavLink
        to="allitems"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? "bg-muted text-primary" : "text-muted-foreground"
          }`
        }
      >
        <Package className="h-5 w-5" />
        All Items
      </NavLink>
      <NavLink
        to="manageitems"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? "bg-muted text-primary" : "text-muted-foreground"
          }`
        }
      >
        <ShoppingCart className="h-5 w-5" />
        Manage Item
      </NavLink>
      <NavLink
        to="buildings"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? "bg-muted text-primary" : "text-muted-foreground"
          }`
        }
      >
        <Building className="h-5 w-5" />
        Buildings
      </NavLink>
      <NavLink
        to="reports"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? "bg-muted text-primary" : "text-muted-foreground"
          }`
        }
      >
        <LineChart className="h-5 w-5" />
        Reports
      </NavLink>
    </>
  );
};

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/landing/dashboard":
      return "Dashboard";
    case "/landing/allitems":
      return "All Items";
    case "/landing/manageitems":
      return "Manage Items";
    case "/landing/buildings":
      return "Buildings";
    case "/landing/reports":
      return "Reports";
    default:
      return "Welcome";
  }
};

export const MenuFrame = () => {
  const { logout, user } = useAuth0();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { logoutUserContext } = useUser();

  const handleLogout = () => {
    logoutUserContext();
    logout({ logoutParams: { returnTo: window.location.origin } }); // Logout from Auth0
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Menubar />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium mt-6">
              <Menubar />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="md:hidden">
          <h1 className="font-bold text-xl">{pageTitle}</h1>
        </div>
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
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="max-w-7xl flex flex-1 place-self-center flex-col gap-4 px-8 lg:gap-6">
        <Outlet />
      </main>
    </div>
  );
};
