import { API } from "./authApi";

export const signupUser = async (data: { email: string; password: string }) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res.data;
  } catch {
    return null;
  }
};

export const signinUser = async (data: { email: string; password: string }) => {
  try {
    const res = await API.post("/auth/signin", data);
    return res.data;
  } catch {
    return null;
  }
};

export const userExist = async (data: { email: string }) => {
  try {
    const res = await API.post("/auth/me", data);
    return res.data;
  } catch {
    return null;
  }
};

export const getMe = async () => {
  try {
    const res = await API.get("/auth/details");
    return res.data;
  } catch {
    return null;
  }
};
