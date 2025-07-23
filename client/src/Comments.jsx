import { useEffect, useState } from "react";

const COMMENT_SERVICE = "http://localhost:3334";

function Comments({ postId, commentsList }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  // Fetch comments for this post
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     const res = await fetch(`${COMMENT_SERVICE}/post/${postId}/comment`);
  //     const data = await res.json();
  //     setComments(data || []);
  //   };

  //   fetchComments();
  // }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch(`${COMMENT_SERVICE}/post/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const updated = await res.json();
    setComments(updated);
    setContent("");
  };

  return (
    <div className="mt-4">
      {commentsList.length ? (
        <>
          <p className="italic text-sm mb-1">
            {commentsList.length} commentsList
          </p>
          <ul className="list-disc list-inside mb-2">
            {commentsList.map((c) => (
              <li key={c.id}>{c.content}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className="italic text-sm mb-1">{comments.length} comments</p>
          <ul className="list-disc list-inside mb-2">
            {comments.map((c) => (
              <li key={c.id}>{c.content}</li>
            ))}
          </ul>
        </>
      )}
      <form onSubmit={handleCommentSubmit}>
        <label className="text-sm block mb-1">Comment</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded mb-2"
        />
        <button className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comments;
