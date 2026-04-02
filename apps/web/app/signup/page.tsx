"use client";

import { useState } from "react";
import { signupUser } from "../lib/auth";
import Image, { type ImageProps } from "next/image";
import Navbar from "../components/Navbar";
import Link from "next/link";
import google from "../../public/google.svg";
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
  //   return (
  //     <div className="min-h-screen w-full">
  //       <Navbar />
  //       <div className="w-full">
  //         <div className="md:max-w-4xl flex mx-auto mt-9">
  //           <div className="flex flex-col gap-6 items-center justify-center ">
  //             <h1 className="text-4xl">
  //               AI Automation starts and scales with Zapier
  //             </h1>
  //             <p>
  //               Orchestrate AI across your teams, tools, and processes. Turn ideas
  //               into automated action today, and power tomorrow’s business growth.
  //             </p>
  //           </div>
  //           <div className="flex flex-col border border-gray-300 p-6 rounded-md shadow">
  //             <form className="flex flex-col gap-6 " onSubmit={handleSubmit}>
  //               <div className="flex flex-col gap-1">
  //                 <h3>Email</h3>
  //                 <input
  //                   name="email"
  //                   type="text"
  //                   placeholder="enter your email"
  //                   className="border rounded-xs p-2"
  //                   onChange={handleChange}
  //                 />
  //               </div>
  //               <div className="flex flex-col gap-1">
  //                 <h3>password</h3>
  //                 <input
  //                   type="password"
  //                   name="password"
  //                   placeholder="enter your password"
  //                   className="border rounded-xs p-2"
  //                   onChange={handleChange}
  //                 />
  //               </div>
  //               <p className="font-light">
  //                 By signing up, you agree to Zapier's terms of service and
  //                 privacy policy.
  //               </p>

  //               <button
  //                 className="bg-amber-500 rounded-2xl p-4 hover:bg-amber-700 text-white"
  //                 type={"submit"}
  //               >
  //                 Signup
  //               </button>
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  return (
    <div className=" min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h1 className="text-[56px] leading-[64px] font-semibold text-gray-900 tracking-tight">
            AI Automation starts and scales with Zapier
          </h1>

          <p className="text-[18px] text-gray-600 leading-relaxed max-w-lg">
            Orchestrate AI across your teams, tools, and processes. Turn ideas
            into automated action today, and power tomorrow’s business growth.
          </p>

          <div className="space-y-4 text-[16px] text-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-orange-500">✔</span>
              <span>Integrate 8,000+ apps and 300+ AI tools without code</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-orange-500">✔</span>
              <span>Build AI-powered workflows in minutes, not weeks</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-orange-500">✔</span>
              <span>14-day trial of all premium features and apps</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <form
          className=" p-8 rounded-xl shadow-sm border border-gray-200 w-[420px] "
          onSubmit={handleSubmit}
        >
          <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-2 font-medium">
            <Image src={google} height={25} width={25} alt="google" />
            Sign up with Google
          </button>

          <div className="text-center my-4 text-gray-400 text-sm">OR</div>
          <label
            htmlFor="email"
            className="text-sm font-medium tracking-wide text-slate-700"
          >
            Email
          </label>
          <input
            className="w-full border p-3 rounded-md mb-4"
            placeholder="Work email"
            name="email"
            type="email"
          />

          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="text-sm font-medium tracking-wide text-slate-700"
            >
              Password
            </label>
            <input
              className="w-full border p-3 rounded-md"
              placeholder="password"
              type="password"
              name="password"
            />
          </div>

          <p className="text-xs text-gray-500 mb-4">
            By signing up, you agree to Zapier's terms of service and privacy
            policy.
          </p>

          <button
            className="w-full bg-orange-500 text-white py-3 rounded-md font-medium"
            type="submit"
          >
            Get started for free
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href={"/signin"}>
              <span className="underline">Log In</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
