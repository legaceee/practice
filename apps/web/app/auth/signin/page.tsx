import Image from "next/image";
import img from "../../../public/signin_img.png";
import google from "../../../public/google.svg";
import Link from "next/link";
import Navbar from "../../components/Navbar";
export default function page() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 gap-16 items-start">
        {/* LEFT SIDE */}
        <div className="bg-[#f4f2ef] rounded-lg p-10 w-full max-w-[540px]">
          <Image src={img} width={120} height={100} alt="img" />

          <h2 className="mt-6 text-[28px] font-semibold text-gray-900">
            Automate across your teams
          </h2>

          <p className="mt-4 text-[15px] text-gray-600 leading-relaxed">
            Zapier Enterprise empowers everyone in your business to securely
            automate their work in minutes, not months—no coding required.
          </p>

          <button className="mt-6 border-2 border-gray-400 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-all ease-in duration-100  hover:border">
            Explore Zapier Enterprise
          </button>
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col items-center">
          <h2 className="text-[22px] font-semibold text-gray-900 mb-6">
            Log in to your account
          </h2>
          <form className="w-full max-w-[420px] bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <button className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-2 font-medium">
              <Image src={google} height={20} width={20} alt="google" />
              Continue with Google
            </button>

            <button className="w-full border border-gray-300 py-3 rounded-md mt-3 font-medium">
              Continue with Facebook
            </button>

            <button className="w-full border border-gray-300 py-3 rounded-md mt-3 font-medium">
              Continue with Microsoft
            </button>

            <button className="w-full border border-gray-300 py-3 rounded-md mt-3 font-medium">
              Continue with SSO
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <label className="text-sm text-gray-700 font-medium">Email *</label>
            <input
              className="w-full mt-1 border p-3 rounded-md mb-4"
              placeholder="Email"
            />

            <button className="w-full bg-gray-200 text-gray-500 py-3 rounded-md font-medium cursor-not-allowed">
              Continue
            </button>

            <p className="text-sm text-center mt-4">
              Don't have a Zapier account?{" "}
              <span className="underline cursor-pointer">Sign Up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
