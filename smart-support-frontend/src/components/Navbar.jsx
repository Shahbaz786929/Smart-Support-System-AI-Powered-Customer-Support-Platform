import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Bell, Menu, LogOut, Search, X } from "lucide-react";
import ticketAPI from "../services/ticketApi";

function Navbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";

    const email    = localStorage.getItem("userEmail") || "user@email.com";
    const initials = email.slice(0, 2).toUpperCase();

    const [query,   setQuery]   = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showDrop, setShowDrop]   = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    const handleSearch = async (val) => {
        setQuery(val);
        if (!val.trim()) { setResults([]); setShowDrop(false); return; }
        try {
            setSearching(true);
            const res = await ticketAPI.get(`/tickets/search?title=${encodeURIComponent(val)}`);
            setResults(res.data || []);
            setShowDrop(true);
        } catch { setResults([]); }
        finally { setSearching(false); }
    };

    const clearSearch = () => {
        setQuery(""); setResults([]); setShowDrop(false);
    };

    const priorityColor = {
        HIGH:   "text-red-500",
        MEDIUM: "text-amber-500",
        LOW:    "text-green-500",
    };

    return (
        <div className="h-14 px-4 flex items-center gap-3 border-b bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-20">

            <button onClick={onMenuClick}
                className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0">
                <Menu size={20} />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onBlur={() => setTimeout(() => setShowDrop(false), 150)}
                    onFocus={() => results.length > 0 && setShowDrop(true)}
                    placeholder="Search tickets..."
                    className="w-full h-9 pl-8 pr-8 rounded-lg text-sm border outline-none bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                />
                {query && (
                    <button onClick={clearSearch}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={13} />
                    </button>
                )}

                {showDrop && (
                    <div className="absolute top-10 left-0 w-full sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        {searching ? (
                            <div className="p-3 text-sm text-slate-400 text-center">Searching...</div>
                        ) : results.length === 0 ? (
                            <div className="p-3 text-sm text-slate-400 text-center">No tickets found</div>
                        ) : (
                            <div className="max-h-60 overflow-y-auto">
                                {results.map(t => (
                                    <button key={t.id} onMouseDown={() => { navigate(`/ticket/${t.id}`); clearSearch(); }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 last:border-0 transition">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.title}</span>
                                            <span className="text-xs text-slate-400 flex-shrink-0">#{t.id}</span>
                                        </div>
                                        {t.priority && (
                                            <span className={`text-xs font-medium ${priorityColor[t.priority] || "text-slate-400"}`}>
                                                {t.priority}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-1">

                <button
                    onClick={() => navigate("/notifications")}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                    title="Notifications">
                    <Bell size={19} />
                </button>

                <button onClick={toggleTheme}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={darkMode ? "Light mode" : "Dark mode"}>
                    {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold mx-1">
                    {initials}
                </div>

                <button onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition">
                    <LogOut size={17} />
                    <span className="hidden sm:inline text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Navbar;