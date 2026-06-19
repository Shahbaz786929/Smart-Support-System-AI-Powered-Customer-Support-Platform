import { useState } from "react";
import Layout from "../components/Layout";
import ticketAPI from "../services/ticketApi";
import { useNavigate } from "react-router-dom";
import { Ticket, CheckCircle, AlertCircle } from "lucide-react";

function CreateTicket() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);
    const [error, setError]       = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError("");
        if (!formData.title.trim() || !formData.description.trim()) {
            setError("Please fill both title and description");
            return;
        }
        try {
            setLoading(true);
            await ticketAPI.post("/tickets/create", formData);
            setSuccess(true);
            setFormData({ title: "", description: "" });
            setTimeout(() => { setSuccess(false); navigate("/my-tickets"); }, 1500);
        } catch (err) {
            console.error(err);
            setError("Failed to create ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Create Ticket</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Submit your issue — AI will auto-categorize and set priority
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                            <CheckCircle size={15} /> Ticket created! AI is analyzing... Redirecting.
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                                Ticket Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Unable to login after password reset"
                                className="w-full h-[46px] rounded-lg px-4 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your issue in detail. Our AI will analyze this to set category and priority automatically."
                                rows={6}
                                className="w-full rounded-lg px-4 py-3 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 resize-none transition"
                            />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg px-4 py-3 flex items-start gap-3">
                            <Ticket size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                <span className="font-semibold">AI-powered:</span> Category and priority will be automatically set by our AI based on your description. No manual selection needed.
                            </p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || success}
                            className="w-full h-[46px] bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition text-sm"
                        >
                            {loading ? "Creating ticket..." : "Create Ticket"}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CreateTicket;