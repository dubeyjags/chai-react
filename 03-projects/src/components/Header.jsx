import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useTheme from "../context/ThemeContext.jsx";

export default function Header() {
 const { user, setUser } = useContext(UserContext);
 const { isDark, setLight } = useTheme();
 const [menuOpen, setMenuOpen] = useState(false);
 const navigate = useNavigate();

 const toggleTheme = () => {
   setLight(() => {
     if(!isDark){
       document.body.classList.remove("light");
      } else{
        document.body.classList.add("light");
      }
     return !isDark;
   });
 };

 const navLinks = [
   { to: "/", label: "Home" },
   { to: "/bg-changer", label: "BG Changer" },
   { to: "/password-generator", label: "Password Generator" },
   { to: "/currency-convertor", label: "Currency Converter" },
   { to: "/todos", label: "Todos" },
 ];

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-gray-900 border-b border-gray-700 px-4 md:px-6 py-2.5">
        <div className="flex justify-between items-center mx-auto">
          <Link to="/" className="flex items-center text-white font-bold text-lg tracking-tight">
             {user ? user.name : "Dubeyjags"}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex font-medium lg:flex-row lg:space-x-8">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 hover:text-violet-400 lg:p-0 ${isActive ? "text-violet-400" : "text-gray-400"}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="text-lg px-2 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
              aria-label="Toggle theme"
            >
              {!isDark ? "☀️" : "🌙"}
            </button>
            <Link
              to="/github"
              className="hidden md:inline-block text-sm px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
            >
              GitHub
            </Link>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu — shown when menuOpen, hidden on lg */}
        {menuOpen && (
          <ul className="lg:hidden mt-2 flex flex-col font-medium border-t border-gray-700 pt-2">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 duration-200 border-b border-gray-700 hover:text-violet-400 ${isActive ? "text-violet-400" : "text-gray-400"}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/github"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 text-gray-400 hover:text-violet-400 duration-200"
              >
                GitHub
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
