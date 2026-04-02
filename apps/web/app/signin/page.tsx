"use client";
import { useState } from "react";
import { signinUser } from "../lib/auth";

export default function page() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await signinUser(form);
      console.log(res);
      alert("Signin successful 🚀");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Signin failed");
    }
  };
  return (
    <div className="w-full">
      <div className="max-w-3xl m-auto p-4">
        <form
          className="flex flex-col gap-3 max-w-2xl m-auto"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <h3>email</h3>
            <input
              className="p-4 border"
              placeholder="enter your email"
              name="email"
              type="email"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <h3>password</h3>
            <input
              className="p-4 border"
              placeholder="enter your password"
              name="password"
              type="password"
              onChange={handleChange}
            />
          </div>
          <div className="max-w-2xs  m-auto">
            <button className="bg-amber-400 p-4">Signin</button>
          </div>
        </form>
      </div>
    </div>
  );
}
