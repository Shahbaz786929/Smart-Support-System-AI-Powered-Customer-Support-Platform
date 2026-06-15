import axios from "axios";

const ticketAPI = axios.create({

baseURL: import.meta.env.VITE_TICKET_API,

headers: {
    "Content-Type": "application/json"
}

});

export default ticketAPI;