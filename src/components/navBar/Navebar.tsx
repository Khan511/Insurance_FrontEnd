import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  User,
  ChevronDown,
  Shield,
  FileText,
  Building2,
  Home,
  Users,
  LogOut,
  Sparkles,
  Menu as MenuIcon,
  X,
  Phone,
} from "lucide-react";
import {
  useGetCurrenttUserQuery,
  useLogoutMutation,
} from "@/services/UserApiSlice";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import "./Navbar.css";

function Navbare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: currentUser, refetch } = useGetCurrenttUserQuery();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      refetch();
      navigate("/login", { replace: true });
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout Error: ", error);
      navigate("/login", { replace: true });
    }
  };

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: "Private Insurance",
      path: "/private-products",
      icon: <Users className="w-4 h-4" />,
      description: "Personal & family coverage",
    },
    {
      name: "Commercial Insurance",
      path: "/commercial-products",
      icon: <Building2 className="w-4 h-4" />,
      description: "Business & enterprise solutions",
    },
    {
      name: "All Products",
      path: "/all-products",
      icon: <Shield className="w-4 h-4" />,
      description: "Complete insurance portfolio",
    },
    {
      name: "Contacts",
      path: "/contact",
      icon: <Phone className="w-4 h-4" />,
      description: "Contact us",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="mb-5"></div>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-1xl border-b border-white/20 shadow-lg shadow-black/5 py-5"
            : "bg-linear-to-b from-white/95 to-white/80 backdrop-blur-md py-4"
        }`}
      >
        {/* Decorative top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500"></div>

        {/* Floating particles (subtle) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none ">
          <div className="absolute top-4 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-2 right-20 w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute top-6 left-1/4 w-1.5 h-1.5 bg-emerald-400/20 rounded-full animate-pulse animation-delay-1500"></div>
        </div>

        <div className="container mx-auto px-4 md:px-5 flex justify-center items-center">
          <div className="flex items-center justify-center gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl text-white bg-linear-to-br from-blue-600 to-cyan-500   shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className=" font-bold bg-linear-to-r text-black from-gray-900 to-gray-700 bg-clip-text ">
                  Naji Insurance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1   justify-center  ">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-1 mb-0">
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <Link to={item.path}>
                        <Button
                          variant="ghost"
                          className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                            isActive(item.path)
                              ? "text-blue-600 bg-blue-50/80"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50/50"
                          }`}
                        >
                          {isActive(item.path) && (
                            <div className="absolute -bottom-1 left-1/2 w-6 h-1 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full -translate-x-1/2"></div>
                          )}
                          <span className="flex items-center gap-2">
                            {item.icon}
                            {item.name}
                          </span>
                        </Button>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* File Claim Button */}
              {currentUser?.status == 200 && currentUser?.data.user && (
                <Link to="/file-claim">
                  <Button
                    variant="outline"
                    className="relative px-5 py-2 rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 hover:text-amber-800 hover:border-amber-300 hover:shadow-lg transition-all group"
                  >
                    <div className="absolute -inset-0.5 bg-linear-to-r from-amber-400 to-orange-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      File Claim
                    </span>
                  </Button>
                </Link>
              )}

              {/* User area */}
              {currentUser?.status !== 200 && !currentUser?.data.user ? (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="px-5 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50/50"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/create-user">
                    <Button className="px-5 py-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="relative group flexitems-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white/50 hover:border-blue-200 hover:bg-white transition-all"
                      >
                        <div className="relative">
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-semibold text-gray-900">
                            {currentUser?.data.user?.name?.firstName || "User"}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 p-3 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-xl"
                    >
                      <DropdownMenuLabel className="p-2">
                        <div className="flex items-center gap-3  w-full">
                          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center  font-semibold"></div>
                          <div>
                            <div className=" flex gap-2 font-semibold text-gray-900">
                              <span>
                                {currentUser?.data.user?.name?.firstName}{" "}
                                {currentUser?.data.user?.name?.lastName}
                              </span>{" "}
                              <span className="text-xs text-gray-500">
                                {"(" + currentUser?.data.user?.roles + ")" ||
                                  "Customer"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {currentUser?.data.user?.email}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-2" />
                      <Link to="/my-page/policies">
                        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-gray-50">
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          My Page
                        </DropdownMenuItem>
                      </Link>

                      {currentUser?.data.user?.roles.includes("ADMIN") && (
                        <Link to="/admin">
                          <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-blue-50 text-blue-600">
                            <Shield className="w-4 h-4 mr-3" />
                            Admin Dashboard
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem
                        className="p-3 rounded-xl cursor-pointer hover:bg-red-50 text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative w-12 h-12 rounded-xl hover:bg-gray-100/50"
                  >
                    {mobileOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <MenuIcon className="w-6 h-6" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full max-w-sm p-0 border-l border-gray-100 bg-white/95 backdrop-blur-xl"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            Naji Insurance
                          </div>
                          <div className="text-sm text-gray-500">
                            Secure Your Tomorrow
                          </div>
                        </div>
                      </div>
                      {currentUser?.data.user && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-blue-50 to-cyan-50/50 border border-blue-100">
                          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                            {currentUser.data?.user?.name?.firstName?.charAt(
                              0,
                            ) || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {/* {currentUser.data.user.firstName} */}
                            </div>
                            <div className="text-sm text-gray-500">
                              {/* {currentUser.data.user.role} */}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile navigation */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <nav className="space-y-1">
                        {navigationItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                          >
                            <div
                              className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                                isActive(item.path)
                                  ? "bg-blue-50 text-blue-600"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`p-2 rounded-lg ${
                                  isActive(item.path)
                                    ? "bg-blue-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                {item.description && (
                                  <div className="text-sm text-gray-500">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              {isActive(item.path) && (
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </Link>
                        ))}

                        <div className="pt-4 border-t border-gray-100">
                          <Link
                            to="/file-claim"
                            onClick={() => setMobileOpen(false)}
                          >
                            <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-100">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-100">
                                  <FileText className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-amber-700">
                                    File a Claim
                                  </div>
                                  <div className="text-sm text-amber-600">
                                    Fast & easy process
                                  </div>
                                </div>
                              </div>
                              <Badge className="bg-amber-500 hover:bg-amber-600">
                                Quick
                              </Badge>
                            </div>
                          </Link>
                        </div>
                      </nav>
                    </div>

                    {/* Mobile footer */}
                    <div className="p-6 border-t border-gray-100 space-y-3">
                      {currentUser?.status !== 200 &&
                      !currentUser?.data.user ? (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full rounded-xl py-3"
                            >
                              Log in
                            </Button>
                          </Link>
                          <Link
                            to="/create-user"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Button className="w-full rounded-xl py-3 bg-linear-to-r from-blue-600 to-cyan-500">
                              Create Account
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/my-page/policies"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full rounded-xl py-3"
                            >
                              My Dashboard
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            className="w-full rounded-xl py-3"
                            onClick={() => {
                              handleLogout();
                              setMobileOpen(false);
                            }}
                          >
                            Logout
                          </Button>
                        </>
                      )}
                      <div className="pt-4 text-center">
                        <div className="text-xs text-gray-500">
                          © 2025 Naji Insurance
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Floating action button for mobile */}
      {!currentUser?.data.user && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Link to="/create-user">
            <Button className="rounded-full w-14 h-14 shadow-xl bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              <Sparkles className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbare;
