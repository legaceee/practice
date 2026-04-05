"use client";
import Image from "next/image";
import img from "../../../public/signin_img.png";
import google from "../../../public/google.svg";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { signinUser, userExist } from "../../lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
export default function Page() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const isEmailValid = email.length > 0;
  const isPasswordValid = password.length > 0;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await userExist({ email: email });
      if (res.exists) {
        setStep("password");
        router.push(`?email=${encodeURIComponent(email)}&step=password`);
      } else {
        setStep("email");
        alert("user does not exist");
      }
    } catch (err: any) {
      setStep("email");
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  const handleChange = async (e: any) => {
    setPassword(e.target.value);
  };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signinUser({ email, password });
      if (res) {
        console.log(res);
        alert("sign in succesfull");
      }
    } catch (err: any) {
      alert(err);
    }
  };
  useEffect(() => {
    const stepParam = params.get("step");
    const emailParam = params.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (stepParam === "password") {
      setStep("password");
    }
  }, [params]);
  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-300 mx-auto px-6 pt-12 pb-16">
        <div className="grid grid-cols-[620px_420px] justify-between items-start">
          {/* LEFT SIDE */}
          <div className="pt-14">
            <div className="bg-[#f7f5f2] rounded-xl p-10">
              <Image src={img} width={150} height={110} alt="img" />

              <h2 className="mt-6 text-[26px] font-semibold text-[#111827]">
                Automate across your teams
              </h2>

              <p className="mt-4 text-[15px] text-[#4b5563] leading-6 max-w-125">
                Zapier Enterprise empowers everyone in your business to securely
                automate their work in minutes, not months—no coding required.
              </p>

              <button className="mt-6 border border-[#c7c7c7] px-5 py-2.5 rounded-md text-[14px] font-medium hover:bg-[#f0ede9]">
                Explore Zapier Enterprise
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center">
            {/* HEADING */}
            <h2 className="text-[22px] font-semibold text-[#111827] mb-6">
              Log in to your account
            </h2>
            {step === "email" && (
              <>
                {/* FORM CARD */}
                <form
                  className="w-105 bg-white p-8 rounded-xl border border-[#e5e7eb] shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
                  onSubmit={handleSubmit}
                >
                  <button className="w-full border border-[#d1d5db] py-2.75 rounded-md flex items-center justify-center gap-2 text-[14px] font-medium hover:bg-gray-50">
                    <Image src={google} height={18} width={18} alt="google" />
                    Continue with Google
                  </button>

                  <button className="w-full border border-[#d1d5db] py-2.75 rounded-md mt-3 text-[14px] font-medium hover:bg-gray-50">
                    Continue with Facebook
                  </button>

                  <button className="w-full border border-[#d1d5db] py-2.75 rounded-md mt-3 text-[14px] font-medium hover:bg-gray-50">
                    Continue with Microsoft
                  </button>

                  <button className="w-full border border-[#d1d5db] py-2.75 rounded-md mt-3 text-[14px] font-medium hover:bg-gray-50">
                    Continue with SSO
                  </button>

                  {/* DIVIDER */}
                  <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-[#e5e7eb]"></div>
                    <span className="px-3 text-[13px] text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-[#e5e7eb]"></div>
                  </div>

                  {/* INPUT */}
                  <label className="text-[13px] font-medium text-[#374151]">
                    Email *
                  </label>

                  <input
                    className="w-full mt-1 border border-[#d1d5db] p-2.5 rounded-md focus:border-black outline-none"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {/* BUTTON */}
                  <button
                    className={`w-full mt-4 py-3 rounded-md font-medium transition
    ${
      email.length > 0
        ? "bg-amber-400 text-white cursor-pointer hover:bg-amber-600"
        : "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
    }`}
                    disabled={email.length === 0}
                  >
                    Continue
                  </button>

                  <p className="text-[13px] text-center mt-4 text-gray-600">
                    Don't have a Zapier account?{" "}
                    <span className="underline cursor-pointer">
                      <Link href={"/signup"}>Sign Up </Link>
                    </span>
                  </p>
                </form>{" "}
              </>
            )}
            {step === "password" && (
              <>
                {" "}
                <form
                  className="w-105 bg-white p-8 rounded-xl border border-[#e5e7eb] shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
                  onSubmit={handleLogin}
                >
                  <div className="font-medium text-center mb-5">
                    {`welcome back ${email} !`}
                    <div
                      className="font-medium underline text-center hover:cursor-pointer"
                      onClick={() => {
                        setEmail("");
                        setPassword("");
                        setStep("email");
                        router.replace("?");
                      }}
                    >
                      Not you?
                    </div>
                  </div>

                  <label
                    htmlFor="password"
                    className="text-[13px] font-medium text-[#374151]"
                  >
                    Password *
                  </label>

                  <input
                    name="password"
                    className="w-full mt-1 border border-[#d1d5db] p-2.5 rounded-md focus:border-black outline-none"
                    placeholder="password"
                    type="password"
                    onChange={handleChange}
                  />

                  {/* BUTTON */}
                  <Link href={"/dashboard"}>
                    <button
                      className={`w-full mt-4 py-3 rounded-md font-medium transition
    ${
      password.length > 0
        ? "bg-amber-400 text-white cursor-pointer hover:bg-amber-600"
        : "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
    }`}
                      disabled={password.length === 0}
                    >
                      Continue
                    </button>
                  </Link>
                  <p className="text-[13px] text-center mt-4 text-gray-600">
                    Forgot password?
                  </p>

                  <p className="text-[13px] text-center mt-4 text-gray-600">
                    Don't have a Zapier account?{" "}
                    <span className="underline cursor-pointer">
                      <Link href={"/signup"}>Sign Up </Link>
                    </span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
