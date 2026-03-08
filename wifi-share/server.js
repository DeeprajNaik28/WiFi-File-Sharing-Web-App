const express = require("express")
const fileUpload = require("express-fileupload")
const fs = require("fs")
const QRCode = require("qrcode")
const os = require("os")

const app = express()

app.use(fileUpload())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

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

app.post("/upload",(req,res)=>{

if(!req.files) return res.send("No file")

const file = req.files.file

file.mv("./uploads/"+file.name)

res.send("Uploaded")

})

app.get("/files",(req,res)=>{

fs.readdir("./uploads",(err,files)=>{
res.json(files)
})

})

app.listen(3000,()=>{
console.log("Server running on port 3000")
})