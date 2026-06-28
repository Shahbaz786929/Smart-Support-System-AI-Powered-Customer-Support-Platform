import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import {
    ArrowLeft, RefreshCw, Paperclip, MessageSquare,
    Bot, Send, Upload, Download, User, Clock, Tag
} from "lucide-react";
import RatingWidget from "../components/RatingWidget";

const priorityBadge = {
    HIGH: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
    MEDIUM: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    LOW: "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
};
const statusBadge = {
    OPEN: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    RESOLVED: "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
    PENDING: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    CLOSED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        fetchAll();
    }, [id]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [ticketRes, commentsRes, attachRes] = await Promise.all([
                ticketAPI.get(`/tickets/${id}`),
                ticketAPI.get(`/comments/${id}`),
                ticketAPI.get(`/attachments/${id}`),
            ]);
            setTicket(ticketRes.data);
            setComments(commentsRes.data || []);
            setAttachments(attachRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async () => {
        if (!message.trim()) return;
        try {
            setCommentLoading(true);
            const userEmail = localStorage.getItem("userEmail");
            await ticketAPI.post(`/comments/${id}`, { message, userEmail });
            setMessage("");
            const res = await ticketAPI.get(`/comments/${id}`);
            setComments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setCommentLoading(false);
        }
    };

    const uploadAttachment = async () => {
        if (!selectedFile) return;
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            await ticketAPI.post(`/attachments/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSelectedFile(null);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 2000);
            const res = await ticketAPI.get(`/attachments/${id}`);
            setAttachments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setUploadLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        } catch { return dateStr; }
    };

    const getAttachmentUrl = (filePath) => {
        const base = import.meta.env.VITE_TICKET_API || "";
        return `${base}${filePath}`;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64 text-slate-400 gap-3">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="text-sm">Loading ticket...</span>
                </div>
            </Layout>
        );
    }

    if (!ticket) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <p className="text-slate-500 dark:text-slate-400">Ticket not found.</p>
                    <button onClick={() => navigate("/my-tickets")} className="mt-4 text-blue-600 text-sm hover:underline">
                        Back to My Tickets
                    </button>
                </div>
            </Layout>
        );
    }

    const tabs = [
        { id: "details", label: "Details", icon: Tag },
        { id: "comments", label: `Comments (${comments.length})`, icon: MessageSquare },
        { id: "attachments", label: `Attachments (${attachments.length})`, icon: Paperclip },
    ];

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">

                {/* Back button */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-5 transition">
                    <ArrowLeft size={16} /> Back
                </button>

                {/* Header card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-1">Ticket #{ticket.id}</p>
                            <h1 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                                {ticket.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[ticket.status] || statusBadge.CLOSED}`}>
                                {ticket.status}
                            </span>
                            {ticket.priority && (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge[ticket.priority] || "bg-slate-100 text-slate-600"}`}>
                                    {ticket.priority}
                                </span>
                            )}
                            {ticket.category && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                    {ticket.category}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Assigned to</p>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                                    {ticket.assignedTo || "Unassigned"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Created</p>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                                    {formatDate(ticket.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Created by</p>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5 truncate max-w-[120px]">
                                    {ticket.userEmail || "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition ${activeTab === tab.id ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                                <Icon size={13} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.id === "details" ? "Details" : tab.id === "comments" ? `💬 ${comments.length}` : `📎 ${attachments.length}`}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB: Details */}
                {activeTab === "details" && (
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Description</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {ticket.description}
                            </p>
                        </div>

                        {ticket.summary && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Bot size={16} className="text-blue-600" />
                                    <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300">AI Summary</h2>
                                </div>
                                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                    {ticket.summary}
                                </p>
                            </div>
                        )}

                        {/* Agent status update */}
                        {ticket && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mt-4">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Update Status</h2>
                                <div className="flex gap-2 flex-wrap">
                                    {["OPEN", "PENDING", "RESOLVED", "CLOSED"].map(s => (
                                        <button
                                            key={s}
                                            onClick={async () => {
                                                try {
                                                    await ticketAPI.put(`/tickets/status/${ticket.id}`, { status: s });
                                                    fetchAll();
                                                } catch (e) { console.error(e); }
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${ticket.status === s
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <RatingWidget
                            ticketId={ticket.id}
                            ticketStatus={ticket.status}
                            userEmail={localStorage.getItem("userEmail")}
                            ticketOwnerEmail={ticket.userEmail}
                        />
                    </div>
                )}

                {/* TAB: Comments */}
                {activeTab === "comments" && (
                    <div className="space-y-4">
                        {/* Add comment box */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Add Comment</h2>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your comment..."
                                rows={3}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.ctrlKey) addComment();
                                }}
                                className="w-full rounded-lg px-4 py-3 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 resize-none transition"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-slate-400">Ctrl + Enter to submit</p>
                                <button onClick={addComment} disabled={commentLoading || !message.trim()}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-60 transition">
                                    <Send size={14} />
                                    {commentLoading ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        {comments.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
                                <MessageSquare size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">No comments yet. Be the first to comment.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                                {(comment.userEmail || "U").slice(0, 1).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {comment.userEmail}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-10">
                                            {comment.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: Attachments */}
                {activeTab === "attachments" && (
                    <div className="space-y-4">
                        {/* Upload box */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Upload File</h2>

                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition">
                                <Upload size={22} className="text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedFile ? selectedFile.name : "Click to select a file"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Any file type supported</p>
                                <input type="file" className="hidden"
                                    onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </label>

                            {uploadSuccess && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
                                    File uploaded successfully
                                </p>
                            )}

                            <button onClick={uploadAttachment}
                                disabled={uploadLoading || !selectedFile}
                                className="w-full mt-4 h-[42px] bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium disabled:opacity-60 transition flex items-center justify-center gap-2">
                                <Upload size={15} />
                                {uploadLoading ? "Uploading..." : "Upload"}
                            </button>
                        </div>

                        {/* Attachment list */}
                        {attachments.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
                                <Paperclip size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">No attachments yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {attachments.map((file) => (
                                    <div key={file.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <Paperclip size={14} className="text-slate-500" />
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                                                {file.fileName}
                                            </p>
                                        </div>
                                        <a href={getAttachmentUrl(file.filePath)}
                                            target="_blank" rel="noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex-shrink-0">
                                            <Download size={13} /> View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default TicketDetails;