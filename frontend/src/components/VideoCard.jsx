
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video._id}`, {
      state: { video },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-48 object-cover rounded-xl"
      />

      <h3 className="font-semibold mt-3">
        {video.title}
      </h3>

      <p className="text-gray-500 text-sm mt-1">
        {video.description}
      </p>

      <p className="text-gray-500 text-sm mt-1">
        {video.views} views
      </p>
    </div>
  );
};

export default VideoCard;
