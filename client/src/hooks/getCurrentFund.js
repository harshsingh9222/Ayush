import axiosInstance from "../utils/axios.helper";
import { addFund } from "../store/Fundstate/fundSlice";

export const getCurrentFund = async (dispatch,fundId) => {
    try {
        const response = await axiosInstance.get(`/fund/:${fundId}`);
        console.log("Fund response:", response.data);
        if (response.data.data) {
            const getFund = response.data.data;
            console.log("Current Fund:", getFund);
            dispatch(addFund(getFund));
        }
    } catch (error) {
        console.error("Error fetching current fund:", error);
    }
}