export default function Navbar() {
  return (
    <div className="w-full bg-amber-100 border-b-2">
      <nav className="flex m-auto justify-between max-w-7xl">
        <li>Logo</li>
        <li>SEARCH</li>
        <li>Products</li>
        <li>Apps</li>
        <div>
          <button className="bg-amber-600 p-2 border rounded-2xl mt-1">
            Login/signup
          </button>
        </div>
      </nav>
    </div>
  );
}
