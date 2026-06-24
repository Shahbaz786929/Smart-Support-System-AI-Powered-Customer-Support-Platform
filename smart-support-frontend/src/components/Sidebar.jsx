import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Ticket, FolderOpen,
    Users, BarChart3, Settings, Rocket,
    X, Bell, ShieldCheck
} from "lucide-react";

function Sidebar({ open, onClose }) {
    const location = useLocation();
    const role = localStorage.getItem("userRole");
    const isAdmin = role === "ROLE_ADMIN";

    const userMenu = [
        { name: "Dashboard",        icon: LayoutDashboard, path: "/dashboard" },
        { name: "Create Ticket",    icon: Ticket,          path: "/create-ticket" },
        { name: "My Tickets",       icon: FolderOpen,      path: "/my-tickets" },
        { name: "Assigned Tickets", icon: Users,           path: "/assigned-tickets" },
        { name: "Notifications",    icon: Bell,            path: "/notifications" },
        { name: "Analytics",        icon: BarChart3,       path: "/analytics" },
        { name: "Settings",         icon: Settings,        path: "/settings" },
    ];

    const adminMenu = [
        { name: "Admin Dashboard",  icon: ShieldCheck,     path: "/admin" },
        { name: "Create Ticket",    icon: Ticket,          path: "/create-ticket" },
        { name: "My Tickets",       icon: FolderOpen,      path: "/my-tickets" },
        { name: "Assigned Tickets", icon: Users,           path: "/assigned-tickets" },
        { name: "Notifications",    icon: Bell,            path: "/notifications" },
        { name: "Analytics",        icon: BarChart3,       path: "/analytics" },
        { name: "Settings",         icon: Settings,        path: "/settings" },
    ];

    const menu = isAdmin ? adminMenu : userMenu;

    return (
        <>
            {open && (
                <div onClick={onClose} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
            )}

            <div className={`
                fixed left-0 top-0 h-screen w-64 border-r flex flex-col z-40
                bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800
                transition-transform duration-200
                ${open ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}>
                <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                            <Rocket size={16} />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">Smart Support</h1>
                            <p className="text-xs text-slate-400">
                                {isAdmin ? "Admin Panel" : "AI ticket management"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-slate-500 p-1">
                        <X size={20} />
                    </button>
                </div>

                {isAdmin && (
                    <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                            <ShieldCheck size={13} /> Administrator Access
                        </p>
                    </div>
                )}

                <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${active
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Sidebar;