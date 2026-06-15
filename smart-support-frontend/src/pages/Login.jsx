import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async () => {

        if (!loginData.email || !loginData.password) {

            alert(
                "Please fill all fields"
            );

            return;

        }

        try {

            setLoading(true);

            const response = await loginUser(
                loginData
            );

            localStorage.setItem(
                "accessToken",
                response.accessToken
            );

            localStorage.setItem(
                "refreshToken",
                response.refreshToken
            );

            localStorage.setItem(
                "userEmail",
                loginData.email
            );

            alert(
                "Login Successful 🚀"
            );

            navigate("/dashboard");

        }
        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||
                "Invalid Email or Password"

            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className={`min-h-screen flex ${darkMode
                ? "bg-[#0F172A]"
                : "bg-[#F8FAFC]"
            }`}>

            {/* Left */}

            <div className="w-full lg:w-1/2 flex justify-center items-center p-5">

                <div className={`w-full max-w-[450px]
                rounded-[30px]
                px-8 py-8
                shadow-2xl border
                ${darkMode
                        ? "bg-[#1E293B] border-slate-700"
                        : "bg-white border-gray-100"
                    }`}>

                    {/* Mobile Theme Button */}

                    <div className="flex justify-end lg:hidden">

                        <button
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                            className="border rounded-lg px-4 py-2"
                        >

                            {darkMode
                                ? "☀"
                                : "🌙"}

                        </button>

                    </div>

                    {/* Logo */}

                    <div className="flex items-center gap-3 mb-8">

                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex justify-center items-center text-white font-bold">

                            SS

                        </div>

                        <h1 className={`text-[28px] font-bold ${darkMode
                                ? "text-white"
                                : "text-slate-900"
                            }`}>

                            Smart
                            <span className="text-blue-600 ml-2">

                                Support

                            </span>

                        </h1>

                    </div>

                    <h2 className={`text-4xl font-bold text-center ${darkMode
                            ? "text-white"
                            : "text-slate-900"
                        }`}>

                        Welcome Back

                    </h2>

                    <p className="text-center text-gray-400 mt-2">

                        Login to continue

                    </p>

                    {/* Inputs */}

                    <div className="space-y-4 mt-8">

                        <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={`w-full h-[55px]
                            rounded-xl px-4 border outline-none
                            ${darkMode
                                    ? "bg-[#334155] border-slate-600 text-white"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        />

                        <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={`w-full h-[55px]
                            rounded-xl px-4 border outline-none
                            ${darkMode
                                    ? "bg-[#334155] border-slate-600 text-white"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        />

                    </div>

                    {/* Remember */}

                    <div className={`flex justify-between mt-5 text-sm ${darkMode
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}>

                        <label className="flex gap-2">

                            <input type="checkbox" />

                            Remember me

                        </label>

                        <span className="text-blue-600 cursor-pointer">

                            Forgot Password?

                        </span>

                    </div>

                    {/* Button */}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full h-[55px]
                        bg-blue-600 rounded-xl
                        text-white font-semibold
                        mt-6 hover:bg-blue-700"
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"}

                    </button>

                    <p className={`text-center mt-6 ${darkMode
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}>

                        Don't have an account?

                        <Link
                            to="/register"
                            className="text-blue-600 ml-2 font-semibold"
                        >

                            Register

                        </Link>

                    </p>

                </div>

            </div>

            {/* Right Side */}

            <div className={`hidden lg:flex lg:w-1/2 relative px-16 ${darkMode
                    ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
                    : "bg-gradient-to-br from-blue-600 to-indigo-900"
                }`}>

                <button
                    onClick={() =>
                        setDarkMode(!darkMode)
                    }
                    className="absolute top-10 right-10
                    border border-white/20
                    bg-white/10 backdrop-blur-md
                    rounded-xl px-6 py-3 text-white"
                >

                    {darkMode
                        ? "☀ Light"
                        : "🌙 Dark"}

                </button>

                <div className="flex flex-col justify-center text-white">

                    <h1 className="text-6xl font-bold">

                        Smart Support

                    </h1>

                    <h2 className="text-3xl text-blue-300 mt-6">

                        AI-Powered Ticket Management System

                    </h2>

                    <p className="text-xl mt-8 leading-9 text-gray-200">

                        Streamline support operations with AI-driven insights,
                        automatic ticket categorization and intelligent assignment.

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;