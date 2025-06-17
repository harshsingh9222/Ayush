import axiosInstance from "../utils/axios.helper";
import {setCurrentAdmin} from "../store/Adminstate/adminSlice.js"
import { useSelector } from "react-redux";
export const getCurrentAdmin = async(dispatch)=>{
    try {
        const response = await axiosInstance.get("/admin/current-admin");
        console.log("Current Admin response:", response.data);
        // If the response contains user data, dispatch the login action
        if (response?.data?.admin) {
            dispatch(setCurrentAdmin(response.data.admin));
            // console.log("Here i am comming in the getCurren Admin")
            return response.data;
        }
    } catch (error) {
        console.log(error);
        
    }
}