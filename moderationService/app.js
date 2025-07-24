const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const comments = {};

function moderateComment(comment) {
  let res = comment.includes("orange");
  if (res) {
    return "rejected";
  } else {
    return "approved";
  }
}

app.post("/event", async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type == "commentCreated") {
      const { id, content, postId, status } = data;
      const moderationResult = moderateComment(content);
      await axios.post("http://localhost:3340/event", {
        type: "commentModerated",
        data: { id, content, postId, status: moderationResult },
      });
    }
    res.status(201).json("Ok");
  } catch (error) {
    console.log(error);
  }
});

const PORT = 3336;

app.listen(PORT, () => {
  console.log(`app listening on PORT: ${PORT}`);
});
