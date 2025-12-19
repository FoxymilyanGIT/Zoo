import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const navItemClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive 
      ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md" 
      : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"
  }`;

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:scale-105 transition-transform duration-200 flex items-center gap-2">
          <span><img src={logo} alt="logo" className="w-10 h-10" /></span>
          <span className="gradient-text">ZooPark</span>
        </Link>
        <nav className="flex gap-2 items-center">
          <NavLink to="/" className={navItemClass}>
            {t("animals")}
          </NavLink>
          <NavLink to="/events" className={navItemClass}>
            {t("events")}
          </NavLink>
          {user?.role !== "ADMIN" && (
            <NavLink to="/tickets" className={navItemClass}>
              {t("tickets")}
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navItemClass}>
              {t("admin")}
            </NavLink>
          )}
          <button
            onClick={toggleLang}
            className="px-3 py-2 rounded-lg border-2 border-slate-200 text-sm font-medium hover:border-brand-300 hover:bg-brand-50 transition-all duration-200"
          >
            {i18n.language.toUpperCase()}
          </button>
          {user ? (
            <button 
              onClick={logout} 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-medium shadow-md hover:shadow-lg hover:from-slate-800 hover:to-slate-900 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {t("logout")}
            </button>
          ) : (
            <>
              <NavLink to="/login" className={navItemClass}>
                {t("login")}
              </NavLink>
              <NavLink to="/register" className={navItemClass}>
                {t("register")}
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};



