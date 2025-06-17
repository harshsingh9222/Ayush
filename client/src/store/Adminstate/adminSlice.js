import { createSlice, current } from "@reduxjs/toolkit";

const initialState={
    currentAdminStatus:false,
    currentAdminData:null
};

const adminSlice= createSlice({
    name:'admin',
    initialState,
    reducers:{
        setCurrentAdmin: (state,action) => {
            state.currentAdminStatus = true;
            state.currentAdminData = action.payload;
        },
        logoutAdmin:(state)=>{
            state.currentAdminStatus = false;
            state.currentAdminData = null;
        }
    }
});

export const {setCurrentAdmin,logoutAdmin}=adminSlice.actions;
export default adminSlice.reducer;