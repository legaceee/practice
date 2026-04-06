import axios from "axios";
export const API = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh route
        await API.post("/auth/refresh");

        //  retry original request
        return API(originalRequest);
      } catch (refreshError) {
        //  refresh failed → logout
        window.location.href = "/signin";
      }
    }

    return Promise.reject(err);
  },
);
