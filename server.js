const express = require("express")
const QRCode = require("qrcode")

const http = require("http")
const { Server } = require("socket.io")

const app = express()

const server = http.createServer(app)

const io = new Server(server)

app.use(express.static("public"))

/* ---------- QR CODE ---------- */

app.get("/qr", async (req,res)=>{

const url =
process.env.RENDER_EXTERNAL_URL ||
`${req.protocol}://${req.get("host")}`

const qr = await QRCode.toDataURL(url)

res.send({url,qr})

})

/* ---------- SOCKET.IO ---------- */

let users = {}

io.on("connection",(socket)=>{

users[socket.id] = {
id: socket.id,
name: "Unknown Device"
}

io.emit("users", Object.values(users))

console.log("Device connected:", socket.id)

socket.on("set-name",(name)=>{

users[socket.id].name = name

io.emit("users", Object.values(users))

})

/* ---------- OFFER ---------- */

socket.on("offer",(data)=>{

io.to(data.target).emit("offer",{
offer:data.offer,
from:socket.id
})

})

/* ---------- ANSWER ---------- */

socket.on("answer",(data)=>{

io.to(data.target).emit("answer",{
answer:data.answer
})

})

/* ---------- ICE ---------- */

socket.on("ice-candidate",(data)=>{

io.to(data.target).emit("ice-candidate",{
candidate:data.candidate
})

})

/* ---------- DISCONNECT ---------- */

socket.on("disconnect",()=>{

delete users[socket.id]

io.emit("users", Object.values(users))

console.log("Device disconnected")

})

})

/* ---------- SERVER ---------- */

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port", PORT)
})