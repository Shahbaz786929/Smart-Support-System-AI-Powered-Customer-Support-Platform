import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;