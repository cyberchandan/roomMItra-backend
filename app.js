const express=require('express')
const cors=require('cors')
require("dotenv").config();
const db= require('./config/db')
const authRoutes=require('./routes/authRoutes')
const protect = require("./middleware/authMiddleware");
const roomRoutes = require("./routes/roomRoutes");


const app=express()
db()
require("./models/User");
require("./models/Room");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);


app.get("/api/protected", protect, (req, res) => {
    res.json({
      message: "Protected route accessed ✅",
      user: req.user,
    });
  });

  app.get('/',(req,res)=>{
    console.log('server running dear')
    res.send('server running roomitra')
  })

const PORT= process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on ${PORT} port`)
})
