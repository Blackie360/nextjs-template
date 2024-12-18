import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
            {isHomePage ? (
              <Link to="/dashboard">
                <Button variant="default">Get Started</Button>
              </Link>
            ) : (
              <Button variant="default">Create Event</Button>
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
              {isHomePage ? (
                <Link to="/dashboard">
                  <Button className="w-full" variant="default">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" variant="default">
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};