import axiosInstance from '../utils/axios.helper';
import { logout } from './authSlice';

export const performLogout = () => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    if (res.status === 200) {
      console.log('Logout successful:', res.data);
      // Optionally, you can handle any additional cleanup here
    } else {
      console.error('Logout failed:', res.data);
    }

  } catch (err) {
    /* even if the request fails, we’ll clear client state */
    console.error('Error during logout:', err.response?.data || err.message);
    // console.log('err :>> ', err);
    if (err.response && err.response.status === 401) {
      console.error('Unauthorized access, user might already be logged out.');
    } else {
      console.error('Logout error:', err);
    }
  } finally {
    // Clear the Authorization header and dispatch logout action
    delete axiosInstance.defaults.headers.common['Authorization'];
    dispatch(logout());
  }
};
