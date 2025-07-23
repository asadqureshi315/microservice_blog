import { useEffect, useState } from "react";
import Comments from "./Comments";

const POST_SERVICE = "http://localhost:3333";
const QUERY_POST_SERVICE = "http://localhost:3335";

function Posts() {
  const [posts, setPosts] = useState({});
  const [title, setTitle] = useState("");

  // Fetch all posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${QUERY_POST_SERVICE}/query-post`);
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(`${POST_SERVICE}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newPost = await res.json();
    setPosts((prev) => ({
      ...prev,
      [newPost.id]: newPost,
    }));
    setTitle("");
  };

  return (
    <div>
      <div className="bg-gray-800 p-4 rounded mb-6 max-w-md">
        <h2 className="text-xl font-bold mb-2">Create Post</h2>
        <form onSubmit={handlePostSubmit}>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded mb-2"
          />
          <button className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 text-white">
            Submit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(posts).map((post) => (
          <div key={post.id} className="bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <Comments postId={post.id} commentsList={post?.comments || []} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
