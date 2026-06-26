import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#1a56db] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <span className="font-bold text-lg text-[#0f1923]" style={{ fontFamily: "Sora, sans-serif" }}>
            Nagar<span className="text-[#1a56db]">Seva</span>
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
        <Link to="/"className="text-sm font-medium text-gray-600 hover:text-[#0f1923] hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
            Home
          </Link>
        <Link to="/features"className="text-sm font-medium text-gray-600 hover:text-[#0f1923] hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
            Features
          </Link>
        <Link to="/categories"className="text-sm font-medium text-gray-600 hover:text-[#0f1923] hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
           Categories
          </Link>
        <Link to="/about"className="text-sm font-medium text-gray-600 hover:text-[#0f1923] hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
            About
          </Link>
        </div>

        
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/login" className="text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
            Log in
          </Link>
          <Link to="/register" className="text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
            Register
          </Link>
          <Link to="/report" className="text-sm font-semibold text-white bg-[#1a56db] hover:bg-[#1140a8] px-4 py-2 rounded-lg transition-all">
            Report an issue
          </Link>
        </div>

        {/* Hamburger */}
        <button className="md:hidden p-1.5 text-gray-700" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/>
            </svg>
          ) : (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-1 bg-white">
          {["How it works", "Features", "Categories", "About"].map((item) => (
            <a key={item} href="#" onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-600 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-all">
              {item}
            </a>
          ))}
          <hr className="my-2 border-gray-100" />
          <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50">
            Register
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 px-3 py-2.5 rounded-lg hover:bg-gray-50">Log in</Link>
          <Link to="/report" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-white bg-[#1a56db] text-center px-4 py-2.5 rounded-lg mt-1">Report an issue</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;