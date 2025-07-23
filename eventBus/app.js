const express = require("express")
const { randomBytes } = require("crypto")
const { default: axios } = require("axios")
const app = express()

app.use(express.json())

const comments = {}

app.post('/event', (req, res) => {
    try {
        const event = req.body
        console.log(event)
        axios.post("http://localhost:3333/event", event)
        axios.post("http://localhost:3334/event", event)
        // axios.post("http://localhost:3336/event", event)
        res.status(201).json("Ok")
    } catch (error) {
        console.log(error)
    }
})

const PORT = 3336
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