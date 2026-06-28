import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import {
    Users, Ticket, CheckCircle, TrendingUp,
    RefreshCw, AlertTriangle, BarChart3, Star
} from "lucide-react";

function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${color}`}
                    style={{ width: `${Math.max(pct, 2)}%` }} />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right font-medium">{value}</span>
        </div>
    );
}

function AdminDashboard() {
    const [summary,     setSummary]     = useState(null);
    const [categories,  setCategories]  = useState([]);
    const [priorities,  setPriorities]  = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [allTickets,  setAllTickets]  = useState([]);
    const [ratingData,  setRatingData]  = useState(null);
    const [loading,     setLoading]     = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sumRes, catRes, priRes, usrRes, tickRes, ratingRes] = await Promise.all([
                ticketAPI.get("/api/admin/analytics/summary"),
                ticketAPI.get("/api/admin/analytics/category"),
                ticketAPI.get("/api/admin/analytics/priority"),
                ticketAPI.get("/api/admin/analytics/active-users"),
                ticketAPI.get("/tickets/all"),
                ticketAPI.get("/ratings/admin/all"),
            ]);
            setSummary(sumRes.data);
            setCategories(catRes.data || []);
            setPriorities(priRes.data || []);
            setActiveUsers(usrRes.data || []);
            setAllTickets((tickRes.data || []).slice(0, 10));
            setRatingData(ratingRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (ticketId, status) => {
        try {
            await ticketAPI.put(`/tickets/status/${ticketId}`, { status });
            fetchAll();
        } catch (err) { console.error(err); }
    };

    const maxCat = Math.max(...categories.map(c => c.count || 0), 1);
    const maxPri = Math.max(...priorities.map(p => p.count || 0), 1);
    const maxUsr = Math.max(...activeUsers.map(u => u.ticketCount || 0), 1);

    const statusBadge = {
        OPEN:     "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
        RESOLVED: "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
        PENDING:  "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
        CLOSED:   "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };

    const priorityBadge = {
        HIGH:   "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
        MEDIUM: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
        LOW:    "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-64 text-slate-400 gap-3">
                <RefreshCw size={18} className="animate-spin" />
                <span className="text-sm">Loading admin dashboard...</span>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Admin Dashboard
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">ADMIN</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Complete system overview and management</p>
                </div>
                <button onClick={fetchAll}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total Tickets", value: summary?.totalTickets    ?? 0, icon: Ticket,        color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/40" },
                    { label: "Open",          value: summary?.openTickets     ?? 0, icon: AlertTriangle,  color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-950/40" },
                    { label: "Resolved",      value: summary?.resolvedTickets ?? 0, icon: CheckCircle,    color: "text-green-600",  bg: "bg-green-50 dark:bg-green-950/40" },
                    { label: "Total Users",   value: summary?.totalUsers      ?? 0, icon: Users,          color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/40" },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                                <Icon size={18} className={s.color} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                                <p className="text-xl font-semibold text-slate-900 dark:text-white">{s.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rating Summary */}
            {ratingData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                    {/* Satisfaction Score */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Customer Satisfaction</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center flex-shrink-0">
                                <p className="text-4xl font-bold text-amber-500">{ratingData.averageRating || "—"}</p>
                                <div className="flex gap-0.5 justify-center mt-1">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={14}
                                            className={i <= Math.round(ratingData.averageRating || 0)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-slate-300 dark:text-slate-600"} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{ratingData.totalRatings} reviews</p>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-600 dark:text-green-400 w-16 flex-shrink-0">Positive</span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full rounded-full bg-green-500 transition-all"
                                            style={{ width: `${ratingData.totalRatings > 0 ? (ratingData.positiveRatings / ratingData.totalRatings) * 100 : 0}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-500 w-6 text-right">{ratingData.positiveRatings}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-500 w-16 flex-shrink-0">Negative</span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full rounded-full bg-red-500 transition-all"
                                            style={{ width: `${ratingData.totalRatings > 0 ? (ratingData.negativeRatings / ratingData.totalRatings) * 100 : 0}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-500 w-6 text-right">{ratingData.negativeRatings}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Recent Reviews</h2>
                        {!ratingData.ratings?.length ? (
                            <div className="flex items-center justify-center h-24 text-slate-400 text-sm">No reviews yet</div>
                        ) : (
                            <div className="space-y-3 max-h-44 overflow-y-auto">
                                {ratingData.ratings.slice(0, 5).map((r, i) => (
                                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                            {(r.userEmail || "U").slice(0, 1).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="flex gap-0.5">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} size={11}
                                                            className={s <= r.rating
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-slate-300 dark:text-slate-600"} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400">Ticket #{r.ticketId}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                {r.userEmail}
                                            </p>
                                            {r.comment && (
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                                                    "{r.comment}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                {/* Category breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={15} className="text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">By Category</h2>
                    </div>
                    <div className="space-y-3">
                        {categories.length === 0
                            ? <p className="text-xs text-slate-400 text-center py-4">No data</p>
                            : categories.map((c, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">{c.category || "Unknown"}</span>
                                    </div>
                                    <MiniBar value={c.count || 0} max={maxCat} color="bg-blue-500" />
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Priority breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={15} className="text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">By Priority</h2>
                    </div>
                    <div className="space-y-3">
                        {priorities.length === 0
                            ? <p className="text-xs text-slate-400 text-center py-4">No data</p>
                            : priorities.map((p, i) => {
                                const colors = { HIGH: "bg-red-500", MEDIUM: "bg-amber-500", LOW: "bg-green-500" };
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">{p.priority || "Unknown"}</span>
                                        </div>
                                        <MiniBar value={p.count || 0} max={maxPri} color={colors[p.priority] || "bg-slate-400"} />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                {/* Most active users */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={15} className="text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Most Active Users</h2>
                    </div>
                    <div className="space-y-3">
                        {activeUsers.length === 0
                            ? <p className="text-xs text-slate-400 text-center py-4">No data</p>
                            : activeUsers.slice(0, 5).map((u, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                        {(u.email || "U").slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{u.email}</p>
                                        <MiniBar value={u.ticketCount || 0} max={maxUsr} color="bg-purple-500" />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* All Tickets Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-x-auto">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">All Tickets (Latest 10)</h2>
                {allTickets.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">No tickets found</p>
                ) : (
                    <table className="w-full min-w-[600px] text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                {["ID", "Title", "User", "Status", "Priority", "Change Status"].map(h => (
                                    <th key={h} className="text-left pb-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allTickets.map(t => (
                                <tr key={t.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                                    <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">#{t.id}</td>
                                    <td className="py-3 pr-4 text-sm text-slate-800 dark:text-slate-200 max-w-[140px] truncate">{t.title}</td>
                                    <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">{t.userEmail}</td>
                                    <td className="py-3 pr-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[t.status] || statusBadge.CLOSED}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4">
                                        {t.priority && (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[t.priority] || "bg-slate-100 text-slate-600"}`}>
                                                {t.priority}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3">
                                        <select
                                            value={t.status || ""}
                                            onChange={(e) => updateStatus(t.id, e.target.value)}
                                            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition"
                                        >
                                            <option value="OPEN">OPEN</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="RESOLVED">RESOLVED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}

export default AdminDashboard;