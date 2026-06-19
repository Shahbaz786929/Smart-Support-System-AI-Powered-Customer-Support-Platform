import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Bell, Menu, LogOut } from "lucide-react";

function Navbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";

    const email = localStorage.getItem("userEmail") || "user@email.com";
    const initials = email.slice(0, 2).toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    return (
        <div className="h-14 px-4 flex items-center gap-3 border-b bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-20">

            {/* Hamburger — mobile only */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
            >
                <Menu size={20} />
            </button>

            {/* Search — grows but capped */}
            <div className="flex-1 max-w-xs">
                <input
                    placeholder="Search tickets..."
                    className="w-full h-9 px-3 rounded-lg text-sm border outline-none bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                />
            </div>

            {/* Spacer — pushes right items to end */}
            <div className="flex-1" />

            {/* Right items */}
            <div className="flex items-center gap-1">

                <button
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Notifications"
                >
                    <Bell size={19} />
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={darkMode ? "Light mode" : "Dark mode"}
                >
                    {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold mx-1">
                    {initials}
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    title="Logout"
                >
                    <LogOut size={17} />
                    <span className="hidden sm:inline text-sm">Logout</span>
                </button>

            </div>
        </div>
    );
}

export default Navbar;