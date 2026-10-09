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

        await SocialUser.updateOne({_id:user._id},{token});

        return res.json({token});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}


export const uploadProfilePicture = async(req,res) =>{
    const {token} = req.body;
    console.log(token);

    try{
        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({message:"profile picture updated"});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const updateUserProfile = async(req,res) => {


    try{

        const {token, ...newuserdata} = req.body;

        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const {username, email} = newuserdata;
        const existingUser = await SocialUser.findOne({$or: [{username},{email}]});
        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
                return res.status(400).json({message:"user already exists"});
            }
        }
        Object.assign(user, newuserdata);
        await user.save();

        return res.json({message:"user updated"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}


export const getUserAndProfile = async(req,res) =>{
    try{
        const {token} = req.body;

        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const userProfile = await Profile.findOne({userId: user._id}).populate('userId','name email username profilePicture');

        return res.json(userProfile);
    }catch(err){
        return res.status(500).json({message:err.message});
    }

}


export const updateProfileData = async(req,res) => {
    try{

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}