
 import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

const WatchVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();

  const [video, setVideo] = useState(
    location.state?.video || null
  );
  const [error, setError] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
const [editText, setEditText] = useState("");
const [actionError, setActionError] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");

    return {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch video
  useEffect(() => {
    if (video) return;

    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${API}/videos/${videoId}`,
          getAuthConfig()
        );

        setVideo(response.data.data);
      } catch (err) {
        console.error("Video fetch failed:", err);
        setError(
          err.response?.data?.message ||
            "Video load nahi ho payi."
        );
      }
    };

    fetchVideo();
  }, [videoId, video]);

  // Fetch initial like status
  useEffect(() => {
    let cancelled = false;

    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${API}/likes/videos`,
          getAuthConfig()
        );

        const likedVideos = response.data.data || [];

        const alreadyLiked = likedVideos.some(
          (item) => item.likedVideo?._id === videoId
        );

        if (!cancelled) {
          setIsLiked(alreadyLiked);
        }
      } catch (err) {
        console.error(
          "Like status fetch failed:",
          err.response?.data || err
        );
      }
    };

    fetchLikeStatus();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  // Like / Unlike video
  const handleLike = async () => {
    if (likeLoading) return;

    setLikeLoading(true);
    setLikeError("");

    try {
      const response = await axios.post(
        `${API}/likes/toggle/v/${videoId}`,
        {},
        getAuthConfig()
      );

      setIsLiked(response.data.data.isLiked);
    } catch (err) {
      console.error("Like request failed:", err.response?.data || err);
      setLikeError(
        err.response?.data?.message ||
          "Like request failed. Please login again."
      );
    } finally {
      setLikeLoading(false);
    }
  };

  // Fetch comments
  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentError("");

      try {
        const response = await axios.get(
          `${API}/comments/${videoId}?page=1&limit=50`,
          getAuthConfig()
        );

        const result = response.data.data;

        // aggregatePaginate returns comments inside docs
        const fetchedComments = Array.isArray(result)
          ? result
          : result?.docs || [];

        if (!cancelled) {
          setComments(fetchedComments);
        }
      } catch (err) {
        console.error(
          "Comments fetch failed:",
          err.response?.data || err
        );
      

        if (!cancelled) {
          setCommentError(
            err.response?.data?.message ||
              "Comments load nahi ho paaye."
          );
        }

          
        {actionError && (
  <p className="mt-3 text-sm text-red-400">
    {actionError}
  </p>
)}

      } finally {
        if (!cancelled) {
          setCommentsLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  
  // Start editing a comment
const startEditComment = (comment) => {
  setEditingCommentId(comment._id);
  setEditText(comment.content);
  setActionError("");
};

// Cancel editing
const cancelEditComment = () => {
  setEditingCommentId(null);
  setEditText("");
  setActionError("");
};

// Update comment
const handleUpdateComment = async (commentId) => {
  const content = editText.trim();

  if (!content) {
    setActionError("Comment cannot be empty.");
    return;
  }

  try {
    setActionError("");

    const response = await axios.patch(
      `${API}/comments/c/${commentId}`,
      { content },
      getAuthConfig()
    );

    const updatedComment = response.data.data;

    setComments((previousComments) =>
      previousComments.map((comment) =>
        comment._id === commentId
          ? { ...comment, ...updatedComment }
          : comment
      )
    );

    setEditingCommentId(null);
    setEditText("");
  } catch (err) {
    console.error(
      "Update comment failed:",
      err.response?.data || err
    );

    setActionError(
      err.response?.data?.message ||
        "Comment update nahi ho paaya."
    );
  }
};

// Delete comment
const handleDeleteComment = async (commentId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmed) return;

  try {
    setActionError("");

    await axios.delete(
      `${API}/comments/c/${commentId}`,
      getAuthConfig()
    );

    setComments((previousComments) =>
      previousComments.filter(
        (comment) => comment._id !== commentId
      )
    );
  } catch (err) {
    console.error(
      "Delete comment failed:",
      err.response?.data || err
    );

    setActionError(
      err.response?.data?.message ||
        "Comment delete nahi ho paaya."
    );
  }
};

const handleCommentLike = async (commentId) => {
  try {
    setActionError("");

    const response = await axios.post(
      `${API}/likes/toggle/c/${commentId}`,
      {},
      getAuthConfig()
    );

    const isLiked = response.data.data.isLiked;

    setComments((previousComments) =>
      previousComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              isLiked,
              likesCount: Math.max(
                0,
                (comment.likesCount || 0) + (isLiked ? 1 : -1)
              ),
            }
          : comment
      )
    );
  } catch (err) {
    console.error(
      "Comment like failed:",
      err.response?.data || err
    );

    setActionError(
      err.response?.data?.message ||
        "Comment like nahi ho paaya. Please login again."
    );
  }
};

// Add comment
const handleAddComment = async (e) => {
  e.preventDefault();

  const content = commentText.trim();

  if (!content) {
    setCommentError("Please comment likho.");
    return;
  }

  setCommentLoading(true);
  setCommentError("");

  try {
    const response = await axios.post(
      `${API}/comments/${videoId}`,
      { content },
      getAuthConfig()
    );

    const newComment = response.data.data;

    setComments((previousComments) => [
      {
        ...newComment,
        owner: newComment.owner || {},
        likesCount: 0,
        isLiked: false,
      },
      ...previousComments,
    ]);

    setCommentText("");
  } catch (err) {
    console.error(
      "Add comment failed:",
      err.response?.data || err
    );

    setCommentError(
      err.response?.data?.message ||
        "Comment add nahi ho paaya. Login check karo."
    );
  } finally {
    setCommentLoading(false);
  }
};
  

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!video) {
    return <p className="p-6">Loading video...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <Link
        to="/"
        className="inline-block mb-5 text-blue-400"
      >
        ← Back to Home
      </Link>

      <div className="max-w-5xl mx-auto">
        <video
          key={video._id}
          src={video.videoFile}
          controls
          muted={false}
          playsInline
          preload="metadata"
          className="w-full rounded-xl bg-black"
        />

        <div className="flex items-center justify-between gap-4 mt-5">
          <h1 className="text-2xl font-bold">
            {video.title}
          </h1>

          <button
            onClick={handleLike}
            disabled={likeLoading}
            aria-pressed={isLiked}
            className={`shrink-0 rounded-full px-5 py-2 font-semibold transition ${
              isLiked
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            } disabled:opacity-50`}
          >
            {likeLoading
              ? "Please wait..."
              : isLiked
              ? "♥ Liked"
              : "♡ Like"}
          </button>
        </div>

        {likeError && (
          <p className="mt-2 text-sm text-red-400">
            {likeError}
          </p>
        )}

        <p className="text-gray-300 mt-3">
          {video.description}
        </p>

        <p className="text-gray-400 mt-2">
          {video.views} views
        </p>

        {/* Comments section */}
        <section className="mt-10 border-t border-gray-800 pt-6">
          <h2 className="text-xl font-bold mb-5">
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleAddComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              maxLength={2000}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white outline-none focus:border-blue-500"
            />

            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="rounded-full bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {commentLoading
                  ? "Posting..."
                  : "Add Comment"}
              </button>
            </div>
          </form>

          {commentError && (
            <p className="mt-3 text-sm text-red-400">
              {commentError}
            </p>
          )}

          {commentsLoading ? (
            <p className="mt-6 text-gray-400">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="mt-6 text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-800 pb-4"
                >
                  <div className="flex items-center gap-3">
                    {comment.owner?.avatar?.url ? (
                      <img
                        src={comment.owner.avatar.url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 font-bold">
                        {(comment.owner?.fullName ||
                          comment.owner?.username ||
                          "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {comment.owner?.fullName ||
                          comment.owner?.username ||
                          "User"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {comment.createdAt
                          ? new Date(
                              comment.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  {editingCommentId === comment._id ? (
  <div className="mt-3">
    <textarea
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      rows={3}
      maxLength={2000}
      className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white outline-none focus:border-blue-500"
    />

    <div className="flex gap-3 mt-2">
      <button
        onClick={() => handleUpdateComment(comment._id)}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
      >
        Save
      </button>

      <button
        onClick={cancelEditComment}
        className="rounded-full bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <p className="mt-3 whitespace-pre-wrap wrap-break-word text-gray-200">
    {comment.content}
  </p>
)}


<button
  onClick={() => handleCommentLike(comment._id)}
  aria-pressed={Boolean(comment.isLiked)}
  className={`mt-2 rounded-full px-3 py-1 text-sm transition ${
    comment.isLiked
      ? "bg-purple-600 text-white"
      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
  }`}
>
  {comment.isLiked ? "♥ Liked" : "♡ Like"}
  {" "}
  {comment.likesCount || 0}
</button>


{editingCommentId !== comment._id && (
  <div className="flex gap-4 mt-3">
    <button
      onClick={() => startEditComment(comment)}
      className="text-sm text-blue-400 hover:text-blue-300"
    >
      Edit
    </button>

    <button
      onClick={() => handleDeleteComment(comment._id)}
      className="text-sm text-red-400 hover:text-red-300"
    >
      Delete
    </button>
  </div>
)}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default WatchVideo;