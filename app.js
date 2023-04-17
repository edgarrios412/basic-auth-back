const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const {User} = require("./db.js")

const app = express ()

app.use(express.json())
app.use(cors({origin:"*"}))

app.get("/user", (req,res) =>{
    res.json(User)
})

app.post("/validate", (req,res) =>{
    let {token} = req.body
    token = token.replaceAll("@",".")
    jwt.verify(token,"secret", (err,user) => {
        if(err){ return res.status(400).json({error:"La cuenta no pudo ser verificada"})}
        const userFind = User.find(u => u.user == user.user)
        userFind.token = null;
        userFind.verified = true;
        res.json(userFind)
    })
})

app.post("/ban", (req,res) =>{
    const {user, reason, time} = req.body
    const userFind = User.find(u => u.user == user)
    if(userFind){
        userFind.banned = true;
        userFind.reason = reason;
        userFind.time = time;
        res.json({status:"Banned"})
    }else{
    res.json({error:"User not found"})
    }
})



app.post("/login", (req,res) => {
    const {user,pass} = req.body
    const userFind = User.find(u => u.user == user && u.pass == pass && u.verified == true)
    if(userFind){
        if(userFind.banned) res.json({error:"User banned", reason: userFind.reason})
        const token = jwt.sign(req.body, "secret", {expiresIn:"10s"})
        res.json(token)
    }else{
        res.json({error:"Datos invalidos o cuenta no verificada"})
    }
})

app.post("/register", (req,res) => {
    const {user,pass} = req.body
    if(user.length < 1 || pass.length < 1){ return res.status(400).json({error:"Los campos no pueden estar vacios"})}
    const userFind = User.find(u => u.user == user)
    if(userFind){ return res.status(400).json({error:"Ese usuario ya existe"})}
    const toke = jwt.sign(req.body, "secret")
    const token = toke.replaceAll(".","@")
    obj={
        user,
        pass,
        verified:false,
        banned:false,
        token
    }
    User.push(obj)
    res.status(200).json(obj.token)
})

app.get("/", (req,res) => {
    res.status(200).json({status:200})
})

app.post("/auth", (req,res) => {
    const token = req.get("authorization").split(" ")[1]
    jwt.verify(token, "secret", (err, user) => {
        err ? res.json({auth:false}) : res.json({auth:true})
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on port 3000")
})