import { useState, useEffect } from "react";
import ticketAPI from "../services/ticketApi";
import { Star, Send, CheckCircle } from "lucide-react";

function RatingWidget({ ticketId, ticketStatus, userEmail, ticketOwnerEmail }) {

    const [existingRating, setExistingRating] = useState(null);
    const [hovered,  setHovered]  = useState(0);
    const [selected, setSelected] = useState(0);
    const [comment,  setComment]  = useState("");
    const [loading,  setLoading]  = useState(false);
    const [success,  setSuccess]  = useState(false);
    const [error,    setError]    = useState("");
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkExisting();
    }, [ticketId]);

    const checkExisting = async () => {
        try {
            const res = await ticketAPI.get(`/ratings/${ticketId}`);
            setExistingRating(res.data);
            setSelected(res.data.rating);
        } catch {
            // No rating yet — that's fine
        } finally {
            setChecking(false);
        }
    };

    const handleSubmit = async () => {
        if (!selected) { setError("Please select a rating"); return; }
        setError("");
        try {
            setLoading(true);
            await ticketAPI.post(`/ratings/${ticketId}`, {
                rating: selected,
                comment: comment.trim() || null
            });
            setSuccess(true);
            setExistingRating({ rating: selected, comment });
        } catch (err) {
            setError(err.response?.data || "Failed to submit rating");
        } finally {
            setLoading(false);
        }
    };

    // Sirf ticket owner ko dikhao, sirf RESOLVED tickets pe
    const isOwner = userEmail === ticketOwnerEmail;
    if (ticketStatus !== "RESOLVED" || !isOwner) return null;
    if (checking) return null;

    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    const colors = ["", "text-red-500", "text-orange-500", "text-amber-500", "text-blue-500", "text-green-500"];

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mt-4">

            {existingRating && !success ? (
                // Already rated
                <div className="flex flex-col items-center py-2 gap-3">
                    <CheckCircle size={28} className="text-green-500" />
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        You rated this ticket
                    </h2>
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                            <Star
                                key={i}
                                size={24}
                                className={i <= existingRating.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-300 dark:text-slate-600"}
                            />
                        ))}
                    </div>
                    {existingRating.comment && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center italic">
                            "{existingRating.comment}"
                        </p>
                    )}
                </div>
            ) : success ? (
                // Just submitted
                <div className="flex flex-col items-center py-2 gap-3">
                    <CheckCircle size={28} className="text-green-500" />
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Thank you for your feedback!
                    </h2>
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                            <Star
                                key={i}
                                size={24}
                                className={i <= selected
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-300 dark:text-slate-600"}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                // Rating form
                <>
                    <div className="flex items-center gap-2 mb-4">
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Rate your support experience
                        </h2>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Your ticket has been resolved. How was your experience?
                    </p>

                    {/* Stars */}
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <div className="flex gap-2">
                            {[1,2,3,4,5].map(i => (
                                <button
                                    key={i}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setSelected(i)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        className={
                                            i <= (hovered || selected)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-slate-300 dark:text-slate-600"
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                        {(hovered || selected) > 0 && (
                            <span className={`text-sm font-medium ${colors[hovered || selected]}`}>
                                {labels[hovered || selected]}
                            </span>
                        )}
                    </div>

                    {/* Comment */}
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional: Tell us more about your experience..."
                        rows={3}
                        className="w-full rounded-lg px-4 py-3 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 resize-none transition mb-3"
                    />

                    {error && (
                        <p className="text-xs text-red-500 mb-3">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selected}
                        className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium disabled:opacity-60 transition flex items-center justify-center gap-2"
                    >
                        <Send size={14} />
                        {loading ? "Submitting..." : "Submit Rating"}
                    </button>
                </>
            )}
        </div>
    );
}

export default RatingWidget;