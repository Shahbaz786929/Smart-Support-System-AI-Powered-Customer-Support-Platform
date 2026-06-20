import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import { Bell, RefreshCw, CheckCheck, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Notifications() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchRecent(); }, []);

    const fetchRecent = async () => {
        setLoading(true);
        try {
            const [myRes, assignedRes] = await Promise.all([
                ticketAPI.get("/tickets/my"),
                ticketAPI.get(`/tickets/assigned?agentEmail=${localStorage.getItem("userEmail")}`),
            ]);

            const myTickets = (myRes.data || []).map(t => ({
                ...t,
                notifType: "created",
                message: `You created ticket: "${t.title}"`
            }));

            const assignedTickets = (assignedRes.data || []).map(t => ({
                ...t,
                notifType: "assigned",
                message: `Ticket assigned to you: "${t.title}"`
            }));

            const combined = [...myTickets, ...assignedTickets]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 20);

            setTickets(combined);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleString("en-IN", {
                day: "numeric", month: "short",
                hour: "2-digit", minute: "2-digit"
            });
        } catch { return dateStr; }
    };

    const iconColor = {
        created:  "bg-blue-100 dark:bg-blue-950/50 text-blue-600",
        assigned: "bg-purple-100 dark:bg-purple-950/50 text-purple-600",
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your recent ticket activity</p>
                    </div>
                    <button onClick={fetchRecent}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48 text-slate-400 gap-3">
                        <RefreshCw size={18} className="animate-spin" />
                        <span className="text-sm">Loading notifications...</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                        <Bell size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {tickets.map((t, i) => (
                            <button key={`${t.id}-${i}`}
                                onClick={() => navigate(`/ticket/${t.id}`)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-4 hover:border-blue-400 dark:hover:border-blue-700 transition text-left">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor[t.notifType]}`}>
                                    {t.notifType === "assigned" ? <CheckCheck size={16} /> : <Ticket size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-800 dark:text-slate-200">{t.message}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-slate-400">{formatDate(t.createdAt)}</span>
                                        {t.status && (
                                            <span className="text-xs text-slate-400">Status: {t.status}</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Notifications;