import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  picture: string;
}

interface HeaderProps {
  user: User | null; // User data passed as a prop
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // Implement your logout logic here
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); // Redirect to home after logout
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black border-b border-zinc-900">
      <h1 className="text-2xl font-bold text-zinc-300">ShopBlox</h1>
      {user && (
        <div className="relative">
          <img
            src={user.picture || "/placeholder.svg"}
            alt={user.username}
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <a
                href="/profile"
                className="block px-4 py-2 text-zinc-800 hover:bg-zinc-200"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </a>
              <button
                className="block w-full text-left px-4 py-2 text-zinc-800 hover:bg-zinc-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header; 