import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/post.routes.js"

dotenv.config();

const app = express();
app.use(cors());


app.use(postRoutes);
app.use(express.json());
app.use(urlencoded({extended:true}));

const start = async() =>{
    const mongoDB = await mongoose.connect(process.env.MONGO_URI)


    app.listen(8000,()=>{
        console.log("your app is running on port 8000");
    })
}

start();