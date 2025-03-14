import "dotenv/config";

import express from 'express'
import  connectDb  from "./db/index.db.js";
import { app } from "./app.js";
connectDb()
.then((res)=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server Started")
    })
})
.catch((err)=>{
    console.log(err+"\nServer Down")
})