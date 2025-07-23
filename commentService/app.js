const express = require("express")
const { randomBytes } = require("crypto")
const app = express()

const cors = require("cors")

app.use(cors({ origin: ["http://localhost:5173"] }))
app.use(express.json())

const comments = {}

app.get('/post/:id/comment', (req, res) => {
    try {
        const postId = req.params.id
        res.send(comments[postId])
    } catch (error) {
        console.log(error)
    }
})

app.post('/post/:id/comment', async (req, res) => {
    try {
        const postId = req.params.id
        const id = randomBytes(4).toString("hex")
        const { content } = req.body
        const commentByPost = comments[postId] || []
        commentByPost.push({ id, content })
        comments[postId] = commentByPost
        await axios.post("http://localhost:3336/event", { type: "commentCreated", data: commentByPost })
        res.status(201).json(comments[postId])
    } catch (error) {
        console.log(error)
    }
})

app.post('/event', (req, res) => {
    try {
        const event = req.body
        console.log("comment", event)
        res.status(201).json("Ok")
    } catch (error) {
        console.log(error)
    }
})

const PORT = 3334
function start() {
    try {
        app.listen(PORT, () => {
            console.log(`app listening on PORT: ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()