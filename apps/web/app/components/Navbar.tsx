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
// import Image from "next/image";
// import logo from "../../public/zapier_logo.svg";
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="w-full border-b border-gray-200 bg-white">
//       <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
//         {/* LEFT */}
//         <div className="flex items-center gap-8">
//           <Link href="/">
//             <Image src={logo} alt="logo" width={80} height={26} />
//           </Link>

//           <div className="hidden md:flex items-center gap-6 text-[14.5px] text-gray-700">
//             <p className="hover:text-black cursor-pointer">Products</p>
//             <p className="hover:text-black cursor-pointer">Solutions</p>
//             <p className="hover:text-black cursor-pointer">Resources</p>
//             <p className="hover:text-black cursor-pointer">Enterprise</p>
//             <p className="hover:text-black cursor-pointer">Pricing</p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-6 text-[14.5px] text-gray-700">
//           <p className="hover:text-black cursor-pointer">Explore apps</p>
//           <p className="hover:text-black cursor-pointer">Contact sales</p>

//           <Link href="/signin">
//             <p className="hover:text-black cursor-pointer">Log in</p>
//           </Link>

//           <Link href="/signup">
//             <button className="bg-[#ff5a00] hover:bg-[#e14f00] text-white px-4 py-[6px] rounded-full text-sm font-medium">
//               Sign up
//             </button>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }
