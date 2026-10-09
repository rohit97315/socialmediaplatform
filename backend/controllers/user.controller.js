import Profile from "../models/profile.model.js";
import SocialUser from "../models/user.model.js";
// import { createHash } from "crypto";
import crypto from "node:crypto";
import bcrypt from "bcrypt";


export const register = async(req,res)=>{
    try{
        const{name , username, email, password} = req.body;

        if(!name || !username || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }

        const user = await SocialUser.findOne({
            email
        })

        if(user){
            return res.status(400).json({message:"user already exists"});
        }


        const hashedPassword = await bcrypt.hash(password,10);
        const newuser = new SocialUser({
            name,
            username,
            email,
            password:hashedPassword
        })

        await newuser.save();

        const profile = new Profile({userId:newuser._id});
        await profile.save();

        return res.json({message:"User created"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}


export const login = async(req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});

        }

        const user = await SocialUser.findOne({
            email
        })

        if(!user){
            return res.status(400).json({message:"user not found please register"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"invalid password"});
        }
        const token = crypto.randomBytes(32).toString("hex");

        await SocialUser.updateOne({id:user._id},{token});

        return res.json({token});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}