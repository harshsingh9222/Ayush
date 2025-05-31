import axiosInstance from "../utils/axios.helper";

export const googleAuth = (code) => {
  return axiosInstance.post('/auth/google/callback', { code });
};


export const registerUser = (data) => {
  return axiosInstance.post('/auth/register', data);
};

export const loginUser = (data) => {
  return axiosInstance.post('/auth/login', data);
};
