import axiosInstance from "../utils/axios.helper";
import { addBusiness } from "../store/businessSlice";

export const fetchBusiness = async (dispatch) => {
    try {
        const response = await axiosInstance.get('/step/getBusiness');
        console.log("Business response:", response.data);
        if(response.data.business){
        const getBusiness = response.data.business;
        console.log("Current Business:", getBusiness);

        dispatch(addBusiness(getBusiness));

        }
    } catch (error) {
    console.error("Error fetching current representative:", error);
    }
}