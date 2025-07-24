const express = require("express");
const { randomBytes } = require("crypto");
const app = express();

const cors = require("cors");
const { default: axios } = require("axios");

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

const comments = {};

app.get("/post/:id/comment", (req, res) => {
  try {
    const postId = req.params.id;
    res.send(comments[postId]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/post/:id/comment", async (req, res) => {
  try {
    const postId = req.params.id;
    const id = randomBytes(4).toString("hex");
    const { content } = req.body;
    const commentByPost = comments[postId] || [];
    commentByPost.push({ id, content, status: "pending" });
    comments[postId] = commentByPost;
    await axios.post("http://localhost:3340/event", {
      type: "commentCreated",
      data: { id, content, postId, status: "pending" },
    });
    res.status(201).json(comments[postId]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/event", async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type == "commentModerated") {
      const { postId, id, content, status } = data;
      const commentByPost = comments[postId] || [];
      const comment = commentByPost.find((itm) => {
        return itm.id == id;
      });
      comment.status = status;
      await axios.post("http://localhost:3340/event", {
        type: "commentUpdated",
        data: data,
      });
    }
    res.status(201).json("Ok");
  } catch (error) {
    console.log(error);
  }
});

const PORT = 3334;
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
