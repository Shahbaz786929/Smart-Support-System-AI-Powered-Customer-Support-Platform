import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Mail, Lock, Sun, Moon } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setError("");
        if (!loginData.email || !loginData.password) {
            setError("Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            const response = await loginUser(loginData);
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("userEmail", loginData.email);
            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">

            {/* Left — Form */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-5">
                <div className="w-full max-w-[420px] rounded-2xl px-6 sm:px-8 py-8 shadow-xl border bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex justify-center items-center text-white font-semibold text-sm">
                                SS
                            </div>
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Smart <span className="text-blue-600">Support</span>
                            </h1>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Log in to manage your support tickets</p>

                    {error && (
                        <div className="mt-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mt-6">
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="you@company.com"
                                    className="w-full h-[46px] rounded-lg pl-10 pr-4 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="••••••••••"
                                    className="w-full h-[46px] rounded-lg pl-10 pr-4 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-3">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full h-[46px] bg-blue-600 rounded-lg text-white font-medium mt-5 hover:bg-blue-700 disabled:opacity-60 transition text-sm"
                    >
                        {loading ? "Signing in..." : "Log in"}
                    </button>

                    <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?
                        <Link to="/register" className="text-blue-600 ml-1.5 font-medium">Register</Link>
                    </p>
                </div>
            </div>

            {/* Right — Hero (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative px-16 bg-gradient-to-br from-blue-600 to-indigo-900 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
                <button
                    onClick={toggleTheme}
                    className="absolute top-10 right-10 flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2.5 text-white text-sm hover:bg-white/20 transition"
                >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    {darkMode ? "Light" : "Dark"}
                </button>
                <div className="flex flex-col justify-center text-white">
                    <h1 className="text-5xl font-semibold">Smart Support</h1>
                    <h2 className="text-2xl text-blue-200 mt-5 font-medium">AI-powered ticket management</h2>
                    <p className="text-lg mt-6 leading-8 text-blue-100/90 max-w-md">
                        Streamline support operations with AI-driven insights, automatic ticket categorization and intelligent assignment.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Login;