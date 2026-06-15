import axios from "axios";

const API = axios.create({
baseURL: import.meta.env.VITE_AUTH_API,


headers: {
    "Content-Type": "application/json"
}


});

export const registerUser = async (userData) => {

const response = await API.post(
    "/auth/register",
    userData
);

return response.data;

};

export const loginUser = async (loginData) => {

const response = await API.post(
    "/auth/login",
    loginData
);

return response.data;

};
