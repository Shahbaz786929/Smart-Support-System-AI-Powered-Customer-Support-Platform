import { useState, useRef, useEffect } from "react";
import ticketAPI from "../services/ticketApi";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

const QUICK_QUESTIONS = [
    "How do I create a ticket?",
    "What are ticket priorities?",
    "How do I reset my password?",
    "How to track my ticket status?",
];

function ChatbotWidget() {
    const [open, setOpen]       = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hi! I'm your Smart Support AI assistant 👋\nHow can I help you today?"
        }
    ]);
    const [input, setInput]     = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef             = useRef(null);

    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    const sendMessage = async (text) => {
        const userMsg = text || input.trim();
        if (!userMsg) return;

        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await ticketAPI.post("/chatbot/ask", { message: userMsg });
            setMessages(prev => [...prev, { role: "bot", text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: "bot",
                text: "Sorry, I'm having trouble responding right now. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat window */}
            {open && (
                <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[520px] flex flex-col rounded-2xl shadow-2xl border bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">AI Assistant</p>
                                <p className="text-xs text-blue-100">Smart Support · Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white/70 hover:text-white transition p-1"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[300px]">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

                                {msg.role === "bot" && (
                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0 mb-0.5">
                                        <Bot size={12} className="text-blue-600" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                                }`}>
                                    {msg.text}
                                </div>

                                {msg.role === "user" && (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
                                        <User size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-end gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                                    <Bot size={12} className="text-blue-600" />
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-2xl rounded-bl-sm">
                                    <Loader2 size={14} className="text-slate-400 animate-spin" />
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Quick questions */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {QUICK_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="text-xs px-2.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 resize-none rounded-xl px-3 py-2 text-sm border outline-none bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition flex-shrink-0 self-end"
                        >
                            <Send size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="fixed bottom-4 right-4 sm:right-6 z-50 w-13 h-13 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition"
                title="AI Assistant"
            >
                {open
                    ? <X size={22} />
                    : <MessageCircle size={22} />
                }
            </button>
        </>
    );
}

export default ChatbotWidget;