"use client";

import { useState } from "react";
import { signupUser } from "../lib/auth";

import Navbar from "../components/Navbar";
export default function Page() {
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
      const res = await signupUser(form);
      console.log(res);
      alert("Signup successful 🚀");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  console.log(form);
  return (
    <div>
      <Navbar />
      <div className="w-full">
        <div className="max-w-4xl flex mx-auto mt-9">
          <div className="flex flex-col gap-6 items-center justify-center ">
            <h1 className="text-4xl">
              AI Automation starts and scales with Zapier
            </h1>
            <p>
              Orchestrate AI across your teams, tools, and processes. Turn ideas
              into automated action today, and power tomorrow’s business growth.
            </p>
          </div>
          <div className="flex flex-col border border-gray-300 p-6">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <h3>Email</h3>
                <input
                  name="email"
                  type="text"
                  placeholder="enter your email"
                  className="border rounded-xs p-2"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3>password</h3>
                <input
                  type="password"
                  name="password"
                  placeholder="enter your password"
                  className="border rounded-xs p-2"
                  onChange={handleChange}
                />
              </div>
              <p className="font-light">
                By signing up, you agree to Zapier's terms of service and
                privacy policy.
              </p>

              <button className="bg-amber-400 rounded-2xl p-4" type={"submit"}>
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
