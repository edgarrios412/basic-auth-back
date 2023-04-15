const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const app = express ()

app.use(express.json())
app.use(cors({origin:"*"}))

app.post("/login", (req,res) => {
    const {user,pass} = req.body
    if(user == "admin" && pass == "admin"){
    const token = jwt.sign(req.body, "secret")
    res.status(200).json({token})
    }else{
        res.json({error:"Datos invalidos"})
    }
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