const express = require("express")
const QRCode = require("qrcode")
const os = require("os")

const http = require("http")
const { Server } = require("socket.io")

const app = express()

const server = http.createServer(app)

const io = new Server(server)

app.use(express.static("public"))

function getLocalIP(){

const nets = os.networkInterfaces()

for(const name of Object.keys(nets)){
for(const net of nets[name]){

if(net.family === "IPv4" && !net.internal){
return net.address
}

}
}

}

app.get("/qr", async (req,res)=>{

const ip = getLocalIP()

const url = `http://${ip}:3000`

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

socket.on("offer",(data)=>{

io.to(data.target).emit("offer",{
offer:data.offer,
from:socket.id
})

})

socket.on("answer",(data)=>{

io.to(data.target).emit("answer",{
answer:data.answer
})

})

socket.on("ice-candidate",(data)=>{

io.to(data.target).emit("ice-candidate",{
candidate:data.candidate
})

})

socket.on("disconnect",()=>{

delete users[socket.id]

io.emit("users", Object.values(users))

console.log("Device disconnected")

})

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port", PORT)
})