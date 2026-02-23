const express=require('express')
const cors=require('cors')
require("dotenv").config();

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    console.log("working / request")
    res.send(" backend server running  ")

})

const PORT= process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on ${PORT} port`)
})
