import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

const refreshAPI = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await refreshAPI.post("/auth/refresh"); //  separate instance
        return API(originalRequest); // retry original request
      } catch (refreshError) {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(err);
  },
);
