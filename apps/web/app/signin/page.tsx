"use client";
import { useState } from "react";
import { signinUser } from "../lib/auth";
import Navbar from "../components/Navbar";

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

  /*
  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-3xl m-auto p-4 flex items-center justify-center border">
        <form className="flex flex-col gap-3  m-auto" onSubmit={handleSubmit}>
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
            <button className="bg-amber-400 p-4 rounded-2xl">Signin</button>
          </div>
        </form>
      </div>
    </div>
  );
  */

  //

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium tracking-wide text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
                name="email"
                type="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium tracking-wide text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Enter your password"
                name="password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Secure sign in
          </p>
        </div>
      </div>
    </div>
  );

  //   return (
  //     <div className="min-h-screen w-full">
  //       <Navbar />
  //       <div className="w-full px-4 py-8 md:py-12">
  //         <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:mt-6 md:flex-row md:items-center md:gap-12">
  //           <div className="flex flex-1 flex-col gap-5">
  //             <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
  //               Welcome back to your automation workspace
  //             </h1>
  //             <p className="text-base leading-relaxed text-slate-600">
  //               Sign in to manage workflows, monitor runs, and keep your teams and
  //               tools connected from one place.
  //             </p>
  //           </div>

  //           <div className="w-full md:max-w-md">
  //             <div className="rounded-md border border-gray-300 bg-white p-6 shadow">
  //               <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
  //                 <div className="flex flex-col gap-1">
  //                   <h3>Email</h3>
  //                   <input
  //                     name="email"
  //                     type="email"
  //                     placeholder="enter your email"
  //                     className="border rounded-xs p-2"
  //                     onChange={handleChange}
  //                     required
  //                   />
  //                 </div>
  //                 <div className="flex flex-col gap-1">
  //                   <h3>Password</h3>
  //                   <input
  //                     type="password"
  //                     name="password"
  //                     placeholder="enter your password"
  //                     className="border rounded-xs p-2"
  //                     onChange={handleChange}
  //                     required
  //                   />
  //                 </div>

  //                 <p className="font-light text-sm text-slate-600">
  //                   By signing in, you agree to our terms of service and privacy
  //                   policy.
  //                 </p>

  //                 <button
  //                   className="bg-amber-500 rounded-2xl p-4 hover:bg-amber-700 text-white"
  //                   type="submit"
  //                 >
  //                   Signin
  //                 </button>
  //               </form>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
}
