import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Users } from "lucide-react";

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

function AssignedTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAssigned(); }, []);

    const fetchAssigned = async () => {
        setLoading(true);
        try {
            const email = localStorage.getItem("userEmail");
            const res = await ticketAPI.get(`/tickets/assigned?agentEmail=${email}`);
            setTickets(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Assigned Tickets</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tickets currently assigned to you</p>
                </div>
                <button onClick={fetchAssigned} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48 text-slate-400 gap-3">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm">Loading assigned tickets...</span>
                </div>
            ) : tickets.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
                    <Users size={36} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h2 className="text-base font-medium text-slate-700 dark:text-slate-300">No assigned tickets</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">No tickets are currently assigned to you.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 cursor-pointer hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{ticket.title}</h2>
                                <span className="text-xs text-slate-400 flex-shrink-0">#{ticket.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{ticket.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[ticket.status] || statusBadge.CLOSED}`}>
                                    {ticket.status}
                                </span>
                                {ticket.priority && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[ticket.priority] || "bg-slate-100 text-slate-600"}`}>
                                        {ticket.priority}
                                    </span>
                                )}
                                {ticket.category && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                        {ticket.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}

export default AssignedTickets;