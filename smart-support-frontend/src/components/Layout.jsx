import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>

        </div>
    );
}

export default Layout;