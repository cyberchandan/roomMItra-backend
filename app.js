const express=require('express')
const cors=require('cors')
require("dotenv").config();
const db= require('./config/db')
const authRoutes=require('./routes/authRoutes')
const protect = require("./middleware/authMiddleware");


const app=express()
db()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes);


app.get("/api/protected", protect, (req, res) => {
    res.json({
      message: "Protected route accessed ✅",
      user: req.user,
    });
  });

const PORT= process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on ${PORT} port`)
})
