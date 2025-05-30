import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    status: false,
    representativeData: null
}
const represetativeSlice = createSlice({  
    name: 'representative',
    initialState,
    reducers:{
        addRepresentative: (state, action) => {
            state.status = true; 
            state.representativeData = action.payload
        },
        removeRepresentative: (state) => {
            state.status = false; 
            state.representativeData = null
        }
    }
});

export const {addRepresentative, removeRepresentative} = represetativeSlice.actions; 

export default represetativeSlice.reducer; 