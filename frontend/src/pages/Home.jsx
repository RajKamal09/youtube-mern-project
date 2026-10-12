import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import VideoCard from "../components/VideoCard.jsx";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          "http://localhost:8000/api/v1/videos",
          {
            withCredentials: true,
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        console.log("Videos response:", response.data);

        setVideos(response.data.data.docs || []);
      } catch (err) {
        console.error("Fetch videos failed:", err);

        setError(
          err.response?.data?.message ||
            "Videos load nahi ho paaye."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      video.title?.toLowerCase().includes(query) ||
      video.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">
            Recommended Videos
          </h1>

          {loading && <p>Loading videos...</p>}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && filteredVideos.length === 0 && (
            <p className="text-gray-500 mt-6">
              No videos found. Try another search!
            </p>
          )}

          {!loading && !error && filteredVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;