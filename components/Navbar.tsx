"use client";

export default function Navbar({ count, logout }: any) {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Smart Bookmarks
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {count} saved links
        </p>
      </div>

      <button
        onClick={logout}
        className="text-sm text-gray-400 hover:text-white transition"
      >
        Logout
      </button>

    </div>
  );
}
