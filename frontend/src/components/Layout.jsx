import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogIn,
  LogOut,
  PlusCircle,
  Search,
  ShieldCheck,
  User,
  UserPlus
} from "lucide-react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

export default function Layout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to={isAuthenticated ? "/dashboard" : "/listings"} className="brand">
          <span className="brand-mark">AC</span>
          <span>
            <strong>ACITY CONNECT</strong>
            <small>Student trades and skills</small>
          </span>
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navClass}>
                <LayoutDashboard size={17} /> Dashboard
              </NavLink>
              <NavLink to="/listings" className={navClass}>
                <Search size={17} /> Listings
              </NavLink>
              <NavLink to="/create-listing" className={navClass}>
                <PlusCircle size={17} /> Create
              </NavLink>
              <NavLink to="/interactions" className={navClass}>
                <ClipboardList size={17} /> Interactions
              </NavLink>
              <NavLink to="/notifications" className={navClass}>
                <Bell size={17} /> Notifications
              </NavLink>
              <NavLink to="/profile" className={navClass}>
                <User size={17} /> Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navClass}>
                  <ShieldCheck size={17} /> Admin
                </NavLink>
              )}
              <button className="nav-button" onClick={logout} title="Log out">
                <LogOut size={17} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/listings" className={navClass}>
                <Search size={17} /> Listings
              </NavLink>
              <NavLink to="/login" className={navClass}>
                <LogIn size={17} /> Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                <UserPlus size={17} /> Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        {user && (
          <p className="signed-in">
            Signed in as <strong>{user.fullName}</strong>
          </p>
        )}
        <Outlet />
      </main>
    </div>
  );
}
