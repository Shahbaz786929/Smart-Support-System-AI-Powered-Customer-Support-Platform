import { useState } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, User, Lock, Bell, CheckCircle } from "lucide-react";
import API from "../services/api";

function Settings() {
    const { theme, toggleTheme } = useTheme();
    const email = localStorage.getItem("userEmail") || "";
    const [activeTab, setActiveTab] = useState("profile");
    const [pwForm, setPwForm]       = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError]     = useState("");

    const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

    const handleChangePassword = async () => {
        setPwError(""); setPwSuccess(false);
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            setPwError("Please fill all fields"); return;
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError("New passwords do not match"); return;
        }
        if (pwForm.newPassword.length < 6) {
            setPwError("New password must be at least 6 characters"); return;
        }
        try {
            setPwLoading(true);
            await API.post("/auth/change-password", {
                email,
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword
            });
            setPwSuccess(true);
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setPwError(err.response?.data?.message || "Failed to change password.");
        } finally {
            setPwLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Lock },
        { id: "appearance", label: "Appearance", icon: Sun },
    ];

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your account preferences</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.id ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
                                <Icon size={15} /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Profile Information</h2>
                            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                                    {email.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{email}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Account member</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block">Email address</label>
                                <input type="email" value={email} disabled
                                    className="w-full h-[46px] rounded-lg px-4 border text-sm bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 cursor-not-allowed" />
                                <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed</p>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Change Password</h2>
                            {pwError && (
                                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">{pwError}</div>
                            )}
                            {pwSuccess && (
                                <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                                    <CheckCircle size={14} /> Password changed successfully
                                </div>
                            )}
                            <div className="space-y-4">
                                {[
                                    { name: "currentPassword", label: "Current password" },
                                    { name: "newPassword", label: "New password" },
                                    { name: "confirmPassword", label: "Confirm new password" },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="text-sm text-slate-600 dark:text-slate-400 mb-1.5 block">{f.label}</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="password" name={f.name} value={pwForm[f.name]} onChange={handlePwChange} placeholder="••••••••"
                                                className="w-full h-[46px] rounded-lg pl-10 pr-4 border outline-none text-sm bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition" />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={handleChangePassword} disabled={pwLoading}
                                    className="w-full h-[46px] bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition text-sm">
                                    {pwLoading ? "Updating..." : "Update password"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === "appearance" && (
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
                            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {theme === "dark" ? <Moon size={18} className="text-slate-400" /> : <Sun size={18} className="text-amber-500" />}
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {theme === "dark" ? "Dark mode" : "Light mode"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={toggleTheme}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${theme === "dark" ? "bg-blue-600" : "bg-slate-200"}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0.5"}`} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <Bell size={18} className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Notifications</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Email notifications for ticket updates</p>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Settings;