import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";

function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 w-6 text-right">{value}</span>
        </div>
    );
}

function Analytics() {
    const [data, setData]     = useState(null);
    const [trend, setTrend]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dashRes, trendRes] = await Promise.all([
                ticketAPI.get("/dashboard"),
                ticketAPI.get("/dashboard/monthly-trend"),
            ]);
            setData(dashRes.data);
            setTrend(trendRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64 text-slate-400 gap-3">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm">Loading analytics...</span>
                </div>
            </Layout>
        );
    }

    const maxTrend = Math.max(...trend.map(t => t.totalTickets || 0), 1);

    return (
        <Layout>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Insights and ticket performance overview</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total", value: data?.totalTickets ?? 0, color: "text-blue-600" },
                    { label: "Open", value: data?.openTickets ?? 0, color: "text-amber-600" },
                    { label: "Resolved", value: data?.resolvedTickets ?? 0, color: "text-green-600" },
                    { label: "Pending", value: data?.pendingTickets ?? 0, color: "text-purple-600" },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
                        <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Priority breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <BarChart3 size={16} className="text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Priority Breakdown</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "High", value: data?.highPriority ?? 0, color: "bg-red-500", text: "text-red-600 dark:text-red-400" },
                            { label: "Medium", value: data?.mediumPriority ?? 0, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
                            { label: "Low", value: data?.lowPriority ?? 0, color: "bg-green-500", text: "text-green-600 dark:text-green-400" },
                        ].map(p => {
                            const max = (data?.highPriority ?? 0) + (data?.mediumPriority ?? 0) + (data?.lowPriority ?? 0) || 1;
                            return (
                                <div key={p.label}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className={`text-xs font-medium ${p.text}`}>{p.label}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{p.value} tickets</span>
                                    </div>
                                    <MiniBar value={p.value} max={max} color={p.color} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly trend */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={16} className="text-blue-600" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly Trend</h2>
                    </div>
                    {trend.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No trend data yet</div>
                    ) : (
                        <div className="space-y-3">
                            {trend.map((t, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">{t.month}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{t.totalTickets}</span>
                                    </div>
                                    <MiniBar value={t.totalTickets || 0} max={maxTrend} color="bg-blue-500" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
}

export default Analytics;