import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Mail, Sun, Moon, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";
    const [email, setEmail]     = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState("");

    const handleSubmit = async () => {
        setError("");
        if (!email) { setError("Please enter your email"); return; }
        try {
            setLoading(true);
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors items-center justify-center p-5">
            <div className="w-full max-w-[420px] rounded-2xl px-6 sm:px-8 py-8 shadow-xl border bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex justify-center items-center text-white font-semibold text-sm">SS</div>
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Smart <span className="text-blue-600">Support</span>
                        </h1>
                    </div>
                    <button onClick={toggleTheme} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                {!success ? (
                    <>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Forgot password?</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Enter your email and we'll send you a reset link.</p>

                        {error && (
                            <div className="mt-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mt-6">
                            <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    placeholder="you@company.com"
                                    className="w-full h-[46px] rounded-lg pl-10 pr-4 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                                />
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading}
                            className="w-full h-[46px] bg-blue-600 rounded-lg text-white font-medium mt-5 hover:bg-blue-700 disabled:opacity-60 transition text-sm">
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/50 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={28} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Check your email</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            We've sent a reset link to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>
                        </p>
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <Link to="/login" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition">
                        <ArrowLeft size={15} /> Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;