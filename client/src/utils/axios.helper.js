import axios from "axios";

console.log("API_BASE_URL: ", import.meta.env.VITE_API_BASE_URL);
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;