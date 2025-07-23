const express = require("express")
const { randomBytes } = require("crypto")
const app = express()

const cors = require("cors")
const { default: axios } = require("axios")

app.use(cors({ origin: ["http://localhost:5173"] }))
app.use(express.json())

const posts = {}

app.get('/post', (req, res) => {
    try {
        res.send(posts)
    } catch (error) {
        console.log(error)
    }
})

app.post('/post', async (req, res) => {
    try {
        const id = randomBytes(4).toString("hex")
        const { title } = req.body
        posts[id] = { id, title }
        await axios.post("http://localhost:3336/event", { type: "postCreated", data: { id, title } })
        res.status(201).json(posts[id])
    } catch (error) {
        console.log(error)
    }
})

app.post('/event', (req, res) => {
    try {
        const event = req.body
        console.log("post", event)
        res.status(201).json("Ok")
    } catch (error) {
        console.log(error)
    }
})

const PORT = 3333
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