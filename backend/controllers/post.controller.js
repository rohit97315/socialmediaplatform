// import { underline } from "pdfkit";
import Comment from "../models/comments.model.js";
import Post from "../models/post.model.js";
import Profile from "../models/profile.model.js";
import SocialUser from "../models/user.model.js";


export const activeCheck = async(req,res) =>{
    return res.status(200).json({message:"RUNNING"});
}


export const createPost = async(req,res) => {
    const {token} = req.body;
    try{
        const user = await SocialUser.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});

        }

        const post = new Post({
            userId:user._id,
            // ...req.body
            body:req.body.body,
            media:req.file != undefined? req.file.filename:"",
            fileType:req.file != undefined? req.file.mimetype.split("/")[1]:""
        })

        await post.save();
        return res.status(200).json({message:"Post Created"}); 
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const getAllPosts = async(req,res) => {
    try{
        const posts = await Post.find().populate('userId','name username email profilePicture');
        return res.json({posts});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const deletePost = async(req,res) => {
    const {token, post_id} = req.body;

    try{
        const user =await SocialUser.findOne({token:token}).select("_id");
        if(!user){
            return res.status(400).json({message:"usernot found"});
        }

        const post = await Post.findOne({_id:post_id});

        if(!post){
            return res.status(400).json({message:"post not found"});
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message:"Unauthorised"});
        }

        await Post.deletePost({_id:post_id});

        return res.json({message:"Post deleted"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const commentPost = async(req,res) => {
    const {token ,post_id,commentbody} = req.body;
    try{
        const user = await SocialUser.findOne({token:token}).select("_id");
        if(!user){
            return res.status(400).json({message:"user found"});
        }

        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }
        const comment = new Comment({
            userId:user._id,
            postId:post_id,
            comment:commentbody
        })

        await comment.save();
        return res.status(200).json({message:"comment added"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const get_comment_by_post = async(req,res) => {
    const {post_id} = req.body;
    try{
        const post = await Post.findOne({"_id":post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        return res.json({comments:post.comments})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const delete_comment_of_user = async(req,res) =>{
    const {token, comment_id} = req.body;
    try{
        const user = await SocialUser.findOne({token:token}).select("_id");
        if(!user){
            return res.status(400).json({message:"user found"});
        }
        const comment = await Comment.findOne({"_id":comment_id});
        if(!comment){
            return res.status(404).json({message:"comment not found"});
        }
        await Comment.deleteOne({"_id":comment_id});

        return res.json({message:"comment deleted"});
    }catch(err){
        return res.status(500).json({message:err.message});
    
    }
}


export const increment_likes = async(req,res) => {
    const{post_id} = req.body;
    try{
        const post = await Post.findOne({"_id":post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }
        post.likes = post.likes+1;
        await post.save();
        return res.json({message:"likes incremented"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}