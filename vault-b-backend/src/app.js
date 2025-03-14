import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
const app=express();
app.use(express.json({limit:"36kb"}))
app.use(express.static("public"));
// ["https://vault-b.netlify.app","http://localhost:5173/"]
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true
    })
  );
  app.use(cookieParser());
// routes import
import {userRouter} from "./routes/user.routes.js";
app.use("/api/v1/user",userRouter)
export {app}