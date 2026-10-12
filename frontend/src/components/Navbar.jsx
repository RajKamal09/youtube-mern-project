 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
   

const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:8000/api/v1/users/logout",
      {},
      {
        withCredentials: true,
      }
    );

    alert("Logout successful");
    navigate("/login");
  } catch (error) {
    console.log("Logout failed:", error.response?.data || error.message);
  }
};
  return (
    <nav className="h-16 border-b flex items-center justify-between px-6">

      <div className="text-2xl font-bold">
        YouTube
      </div>
<input
  type="text"
  placeholder="Search videos..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="border rounded-full px-5 py-2 w-96"
/>

      <button
  onClick={handleLogout}
  className="border px-4 py-2 rounded-full hover:bg-gray-100"
>
  Logout
</button>

    </nav>
  );
};

export default Navbar;