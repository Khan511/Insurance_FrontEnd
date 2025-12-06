import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import {
  useGetCurrenttUserQuery,
  useLogoutMutation,
} from "@/services/UserApiSlice";

function Navbare() {
  const navigate = useNavigate();
  const { data: currentUser, refetch } = useGetCurrenttUserQuery();
  const [logout] = useLogoutMutation();

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            Naji
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/private-products">
                  <Button variant="ghost">Private</Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/commercial-products">
                  <Button variant="ghost">Commercial</Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Insurances</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[200px]">
                    <Link to="/all-products">
                      <NavigationMenuLink>All Insurances</NavigationMenuLink>
                    </Link>
                    <Link to="/admin">
                      <NavigationMenuLink>Admin</NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/file-claim">
            <Button variant="ghost">File Claim</Button>
          </Link>

          {currentUser?.status !== 200 && !currentUser?.data.user ? (
            <Link to="/login">
              <button className="btn btn-primary">Log in</button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/my-page">
                  <DropdownMenuItem>My Page</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/private-products">
                  <Button variant="ghost" className="w-full justify-start">
                    Private
                  </Button>
                </Link>
                <Link to="/commercial-products">
                  <Button variant="ghost" className="w-full justify-start">
                    Commercial
                  </Button>
                </Link>
                <Link to="/all-products">
                  <Button variant="ghost" className="w-full justify-start">
                    All Insurances
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    Admin
                  </Button>
                </Link>
                <Link to="/file-claim">
                  <Button variant="ghost" className="w-full justify-start">
                    File Claim
                  </Button>
                </Link>

                {currentUser?.status !== 200 && !currentUser?.data.user ? (
                  <Link to="/login">
                    <button className="w-full text-white">Log in</button>
                  </Link>
                ) : (
                  <>
                    <Link to="/my-page">
                      <Button variant="ghost" className="w-full justify-start">
                        My Page
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbare;
