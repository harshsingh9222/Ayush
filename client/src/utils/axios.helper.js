import axios from "axios";

console.log("API_BASE_URL: ", import.meta.env.VITE_API_BASE_URL);
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, 
});


export default axiosInstance;