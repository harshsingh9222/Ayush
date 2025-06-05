import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status: false,
    fundData: null
}
const fundSlice = createSlice({ 
    name: 'fund',
    initialState,
    reducers:{
        addFund: (state, action) => {
            state.status = true; 
            state.fundData = action.payload
        },
        removeFund: (state) => {
            state.status = false; 
            state.fundData = null
        }
    }
});

export const {addFund, removeFund} = fundSlice.actions;

export default fundSlice.reducer;