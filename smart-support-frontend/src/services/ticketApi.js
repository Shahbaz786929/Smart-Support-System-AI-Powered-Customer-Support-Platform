import axios from "axios";

const ticketAPI = axios.create({
    baseURL: import.meta.env.VITE_TICKET_API,
    headers: {
        "Content-Type": "application/json"
    }
});

ticketAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default ticketAPI;