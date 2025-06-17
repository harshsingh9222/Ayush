import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import representativeReducer from './representativeSlice';
import businessReducer from './businessSlice'; 
import fundReducer from './Fundstate/fundSlice'
import adminSlice from './Adminstate/adminSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    representative: representativeReducer,
    business: businessReducer,
    fund: fundReducer,
    admin: adminSlice,
  },
});
