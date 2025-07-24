const express = require("express");
const { randomBytes } = require("crypto");
const app = express();

const cors = require("cors");

app.use(cors({ origin: ["http://localhost:5173"] }));

app.use(express.json());

const posts = {};

app.get("/query-post", async (req, res) => {
  try {
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
  }
});

app.post("/event", (req, res) => {
  try {
    const { type, data } = req.body;
    if (type == "postCreated") {
      posts[data.id] = { ...data, comments: [] };
    } else if (type == "commentCreated") {
      let postComments = posts[data.postId].comments || [];
      posts[data.postId].comments = [...postComments, data];
    } else if (type == "commentUpdated") {
      const commentByPost = posts[data.postId].comments;
      const comment = commentByPost.find((itm) => {
        return itm.id == data.id;
      });
      comment.status = data.status;
      comment.content = data.content;
    }
    res.status(201).json("Ok");
  } catch (error) {
    console.log(error);
  }
});

const PORT = 3335;
function start() {
  try {
    app.listen(PORT, () => {
      console.log(`app listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
