import Profile from "../models/profile.model.js";
import SocialUser from "../models/user.model.js";
// import { createHash } from "crypto";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import PDFDocument from "pdfkit"
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex")+".pdf";
    const stream = fs.createWriteStream("uploads/"+outputPath);

    doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:100});
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Usernaem: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`CurrentPosition: ${userData.currentPost}`);
    doc.fontSize(14).text("pastWork:");
    userData.pastWork.forEach((work,index) => {
        doc.fontSize(14).text(`Company Name:${work.company}`);
        doc.fontSize(14).text(`Position:${work.position}`);
        doc.fontSize(14).text(`years:${work.years}`);

    });

    doc.end();
    return outputPath;

}

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
        const {token, ...newProfiledata} = req.body;

        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const profile_to_update = await Profile.findOne({userId:user._id});

        Object.assign(profile_to_update,newProfiledata);
        await profile_to_update.save();


        return res.json({message:"profile updated"});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const getAllUserProfile = async(req,res) => {
    try{
        const profiles = await Profile.find().populate('userId','name username email fieldOfStudy');

        return res.json({profiles});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const downloadProfile = async(req,res) => {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({userId:user_id}).populate('userId','name username email profilePicture');
    let a = await convertUserDataToPDF(userProfile);

    return res.json({"message":a});
}


export const sendConnectionRequest = async(req,res) => {
    const {token, connectionId} = req.body;

    try{
        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const connectionUser = await SocialUser.findOne({_id:connectionId});
        if(!connectionUser){
            return res.status(400).json({message:"connection user not found"});
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId:user._id,
            connectionId:connectionUser._id
        })
        if(existingRequest){
            return res.status(400).json({message:"Request already sent"});
        }
        const request = new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        })

        await request.save();

        return res.json({message:"Request sent"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}


export const getMyConnectionsRequests = async(req,res) => {
    const {token} = req.body;
    try{
        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const connections = await ConnectionRequest.findOne({
            userId:user._id
        }).populate('connectionId','name username email profilePicture');

        return res.json({connections});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



export const whatAreMyConnections = async(req,res) => {
    const {token} = req.body;

    try{
        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const connections = ConnectionRequest.findOne({connectionId:user._id}).populate('userId','name username email profilePicture'); 

        return res.json({connections})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}


export const acceptConnectionRequest = async(req,res) => {
    const {token , requesId, action_type} = req.body;

    try{
        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const connection = await ConnectionRequest.findOne({_id:requesId});
        if(!connection){
            return res.status(400).json({message:"connection not found"});
        }

        if(action_type === "accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }
        await connection.save();

        return res.json({message:"request Updated"});
    }catch(err){

        return res.status(500).json({message:err.message});
    }
}