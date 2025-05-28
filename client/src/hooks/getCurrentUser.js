import axiosInstance from "../utils/axios.helper";
import { login as authLogin, logout as authLogout } from "../store/authSlice";

export const getCurrentUser = async (dispatch) => {
    try {
        const response = await axiosInstance.get("/auth/current-user");
        console.log("Current user response:", response.data);
        // If the response contains user data, dispatch the login action
        if (response?.data?.user) {
            dispatch(authLogin(response.data.user));
            return response.data;
        }
    } catch (error) {
        console.log(error);
        
    }
};