import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status: false,
    businessData: null
}
const businessSlice = createSlice({ 
    name: 'business',
    initialState,
    reducers:{
        addBusiness: (state, action) => {
            state.status = true; 
            state.businessData = action.payload
        },
        removeBusiness: (state) => {
            state.status = false; 
            state.businessData = null
        }
    }
});

export const {addBusiness, removeBusiness} = businessSlice.actions;

export default businessSlice.reducer;