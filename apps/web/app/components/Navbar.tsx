import Image from "next/image";
import logo from "../../public/zapier_logo.svg";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full  border-b border-0 border-gray-200 bg-white flex justify-between items-center h-[64px] px-[40px]">
      <div className="flex gap-6">
        <Link href={"/"}>
          <Image src={logo} alt="logo" height={28} width={85} />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <p className="cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Products
          </p>
          <p className="cursor-pointer hover:text-black hover:rounded-xs hover:bg-gray-200 p-2">
            Solutions
          </p>
          <p className="cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Resources
          </p>
          <p className="cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Enterprise
          </p>
          <p className="cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Pricing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Link href={"/auth/signin"}>
          <p className="text-gray-600 cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Explore apps
          </p>
        </Link>
        <p className="text-gray-600 cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
          Contact sales
        </p>
        <Link href={"/auth/signin"}>
          <p className="text-gray-600 cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Log in
          </p>
        </Link>
        <Link href={"/signup"}>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-800">
            Sign up
          </button>
        </Link>
      </div>
    </nav>
  );
}
