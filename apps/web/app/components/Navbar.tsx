import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-0 border-gray-200 bg-white ">
      <div className="max-w-375 mx-auto flex items-center justify-between p-2">
        <div className="flex gap-6">
          <div className="text-2xl font-bold">_zapier</div>

          {/* MIDDLE - NAV LINKS */}
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
          <p className="text-gray-600 cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Explore apps
          </p>
          <p className="text-gray-600 cursor-pointer hover:text-black hover:bg-gray-200 p-2  hover:rounded-xs">
            Contact sales
          </p>
          <Link href={"/signin"}>
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
      </div>
    </nav>
  );
}
