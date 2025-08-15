import { useState, memo, useCallback } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL } from "@/constants";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-primary-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-[#0ea5e9] flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-primary-900">
              Stupid Simple Apps
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a
              href="#how-it-works"
              className="text-primary-600 hover:text-primary-900 font-medium transition"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-primary-600 hover:text-primary-900 font-medium transition"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-primary-600 hover:text-primary-900 font-medium transition"
            >
              Testimonials
            </a>
            <Button
              asChild
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white"
            >
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedule a Call
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-primary-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-white border-t border-primary-200 ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="container mx-auto px-4 py-3 space-y-2">
          <a
            href="#how-it-works"
            className="block py-2 px-2 text-primary-600 hover:bg-primary-100 rounded"
            onClick={closeMobileMenu}
          >
            How It Works
          </a>
          <a
            href="#about"
            className="block py-2 px-2 text-primary-600 hover:bg-primary-100 rounded"
            onClick={closeMobileMenu}
          >
            About
          </a>
          <a
            href="#testimonials"
            className="block py-2 px-2 text-primary-600 hover:bg-primary-100 rounded"
            onClick={closeMobileMenu}
          >
            Testimonials
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 px-2 bg-[#0ea5e9] text-white rounded text-center"
            onClick={closeMobileMenu}
          >
            Schedule a Call
          </a>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
