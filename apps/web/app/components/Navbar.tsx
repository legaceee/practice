export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-375 mx-auto flex items-center justify-between px-4 py-4">
        {/* LEFT - LOGO */}
        <div className="text-xl font-bold">_zapier</div>

        {/* MIDDLE - NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <p className="cursor-pointer hover:text-black">Products</p>
          <p className="cursor-pointer hover:text-black">Solutions</p>
          <p className="cursor-pointer hover:text-black">Resources</p>
          <p className="cursor-pointer hover:text-black">Enterprise</p>
          <p className="cursor-pointer hover:text-black">Pricing</p>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-5">
          <p className="text-gray-600 cursor-pointer hover:text-black">
            Explore apps
          </p>
          <p className="text-gray-600 cursor-pointer hover:text-black">
            Contact sales
          </p>
          <p className="text-gray-600 cursor-pointer hover:text-black">
            Log in
          </p>

          <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
