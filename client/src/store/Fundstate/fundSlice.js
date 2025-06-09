import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentFundStatus: false,
    currentFundData: null,
    allFundsStatus: false,
    allFundsData: []
}
const fundSlice = createSlice({
    name: 'fund',
    initialState,
    reducers: {
        setAllFunds: (state, action) => {
            state.allFundsStatus = true
            state.allFundsData = action.payload
        },
        setCurrentFund: (state, action) => {
            state.currentFundStatus = true
            state.currentFundData = action.payload
        },
        addFund: (state, action) => {
            state.currentFundStatus = true;
            state.currentFundData = { ...state.currentFundData, ...action.payload }
        },
        removeFund: (state) => {
            state.currentFundStatus = false;
            state.currentFundData = null
        },
        removeAllFunds: (state) => {
            state.allFundsStatus = false
            state.allFundsData = []
        }
    }
});

export const { addFund, removeFund, setAllFunds, setCurrentFund, removeAllFunds } = fundSlice.actions;

export default fundSlice.reducer;