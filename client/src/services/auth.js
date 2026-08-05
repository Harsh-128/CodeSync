import API from "./api";

export const signup = async (userData) => {
    const response = await API.post("/auth/signup", userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await API.post("/auth/login", userData);
    return response.data;
};