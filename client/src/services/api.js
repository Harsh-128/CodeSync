import axios from "axios";

const API = axios.create({
    baseURL: "https://codesync-backend-lifv.onrender.com"
});

export default API;