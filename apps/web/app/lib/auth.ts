import { API } from "./authApi";

export const signupUser = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
};

export const signinUser = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/signin", data);
  return res.data;
};
