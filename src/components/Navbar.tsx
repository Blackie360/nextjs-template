import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isHomePage = location.pathname === '/';
  const navLinks = isHomePage
    ? [
        { href: "#features", label: "Features" },
        { href: "#testimonials", label: "Testimonials" },
        { href: "#pricing", label: "Pricing" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/events", label: "Events" },
        { href: "/settings", label: "Settings" },
      ];

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      duration: 2000,
    });
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              SaaSLogo
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              isHomePage ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-gray-600 hover:text-gray-900 ${
                    location.pathname === link.href ? "text-primary font-medium" : ""
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            {navLinks.map((link) => (
              isHomePage ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 text-gray-600 hover:text-gray-900 ${
                    location.pathname === link.href ? "text-primary font-medium" : ""
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="px-3 py-2">
              {user ? (
                <Button className="w-full" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Link to="/login" className="w-full">
                  <Button className="w-full" variant="default">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};