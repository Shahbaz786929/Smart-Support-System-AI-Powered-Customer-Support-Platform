import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import { Link } from "react-router-dom";
import { Ticket, CheckCircle, Clock, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon size={20} className={color} />
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
            </div>
        </div>
    );
}

const priorityBadge = {
    HIGH:   "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    LOW:    "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
};

const statusBadge = {
    OPEN:     "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    RESOLVED: "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
    PENDING:  "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    CLOSED:   "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function MiniBarChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-36 flex items-center justify-center text-slate-400 text-sm">
                No trend data yet
            </div>
        );
    }
    const max = Math.max(...data.map((d) => d.totalTickets || 0)) || 1;
    return (
        <div className="flex items-end gap-1.5 h-36 pt-2">
            {data.map((d, i) => {
                const pct = Math.round(((d.totalTickets || 0) / max) * 100);
                return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center">
                            {d.totalTickets || 0}
                        </span>
                        <div className="w-full rounded-t-md bg-blue-500 dark:bg-blue-600 transition-all" style={{ height: `${Math.max(pct, 4)}%` }} />
                        <span className="text-[9px] text-slate-400 truncate w-full text-center">
                            {d.month?.slice(0, 3)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function Dashboard() {
    const [stats, setStats]               = useState(null);
    const [trend, setTrend]               = useState([]);
    const [latestTickets, setLatestTickets] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [assigning, setAssigning]       = useState(null);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [dashRes, trendRes, latestRes] = await Promise.all([
                ticketAPI.get("/dashboard"),
                ticketAPI.get("/dashboard/monthly-trend"),
                ticketAPI.get("/tickets/latest"),
            ]);
            setStats(dashRes.data);
            setTrend(trendRes.data || []);
            setLatestTickets((latestRes.data || []).slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const assignTicket = async (ticketId) => {
        const email = localStorage.getItem("userEmail");
        setAssigning(ticketId);
        try {
            await ticketAPI.put(`/tickets/assign/${ticketId}?agentEmail=${email}`);
            fetchAll();
        } catch (err) {
            console.error(err);
        } finally {
            setAssigning(null);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64 text-slate-400 gap-3">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm">Loading dashboard...</span>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Monitor your ticket system activity</p>
                </div>
                <button
                    onClick={fetchAll}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                >
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* 4 stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                <StatCard title="Total Tickets"  value={stats?.totalTickets  ?? 0} icon={Ticket}        color="text-blue-600"   bg="bg-blue-50 dark:bg-blue-950/40" />
                <StatCard title="Open Tickets"   value={stats?.openTickets   ?? 0} icon={AlertTriangle} color="text-amber-600"  bg="bg-amber-50 dark:bg-amber-950/40" />
                <StatCard title="Resolved"       value={stats?.resolvedTickets ?? 0} icon={CheckCircle} color="text-green-600"  bg="bg-green-50 dark:bg-green-950/40" />
                <StatCard title="Pending"        value={stats?.pendingTickets ?? 0} icon={Clock}        color="text-purple-600" bg="bg-purple-50 dark:bg-purple-950/40" />
            </div>

            {/* 3 priority mini cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "High Priority",   value: stats?.highPriority   ?? 0, cls: "text-red-500 dark:text-red-400"   },
                    { label: "Medium Priority", value: stats?.mediumPriority ?? 0, cls: "text-amber-500 dark:text-amber-400" },
                    { label: "Low Priority",    value: stats?.lowPriority    ?? 0, cls: "text-green-500 dark:text-green-400" },
                ].map((p) => (
                    <div key={p.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
                        <p className={`text-2xl font-semibold ${p.cls}`}>{p.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.label}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Table */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* Bar chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={16} className="text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly Trend</h2>
                    </div>
                    <MiniBarChart data={trend} />
                </div>

                {/* Recent tickets table */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-x-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Tickets</h2>
                        <Link to="/my-tickets" className="text-xs text-blue-600 hover:underline">View all →</Link>
                    </div>

                    {latestTickets.length === 0 ? (
                        <div className="h-36 flex items-center justify-center text-slate-400 text-sm">No tickets yet</div>
                    ) : (
                        <table className="w-full min-w-[500px] text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    {["ID", "Title", "Status", "Priority", "Action"].map((h) => (
                                        <th key={h} className="text-left pb-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {latestTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                                        <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-300">#{ticket.id}</td>
                                        <td className="py-3 pr-4 text-slate-700 dark:text-slate-300 max-w-[160px] truncate">{ticket.title}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[ticket.status] || statusBadge.CLOSED}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[ticket.priority] || "bg-slate-100 text-slate-600"}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <button
                                                onClick={() => assignTicket(ticket.id)}
                                                disabled={assigning === ticket.id}
                                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition disabled:opacity-60"
                                            >
                                                {assigning === ticket.id ? "..." : "Assign to me"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;