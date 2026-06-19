import axios from "axios";

const authAPI = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API,
    headers: { "Content-Type": "application/json" }
});

export const registerUser = async (userData) => {
    const response = await authAPI.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await authAPI.post("/auth/login", loginData);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await authAPI.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await authAPI.post("/auth/reset-password", { token, newPassword });
    return response.data;
};