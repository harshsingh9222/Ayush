import axiosInstance from "../utils/axios.helper";
import { addRepresentative } from "../store/representativeSlice";

export const fetchCurrentRepresentative = async (dispatch) => {
      try {
          const response = await axiosInstance.get('/step/getCurrentRepresentative');
          console.log("Response from getCurrentRepresentative:", response);
          if(response.data.representative){
            const getCurrentRepresentative = response.data.representative;
            console.log("Current Representative:", getCurrentRepresentative);

            dispatch(addRepresentative(getCurrentRepresentative));
          }
      } catch (error) {
        console.error("Error fetching current representative:", error);
      }
    }