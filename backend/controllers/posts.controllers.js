// import Profile from "../models/profile.model";
import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

import bcrypt from "bcryptjs";

export const activeCheck = async (req, res)=>{

}

export const creatPost = async (req, res)=>{
   const {token}=req.body;
//    console.log(token);

   try{
    // console.log("Creating post with body:", req.body);
    const user=await User.findOne({token:token});
    // console.log("User found:", user);
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    // console.log("User found:", user._id);
    const post= new Post({
        userId:user._id,
        body:req.body.body,
        media: req.file!= undefined ? req.file.filename:" ",
        fileType:req.file!==undefined? req.file.mimetype.split("/")[1]:""
    });
    // console.log("Post created:", post);
    await post.save();
    // console.log("Post saved successfully:", post);
    // console.log(post);
    return res.status(200).json({message:"Post created successfully", post});

   }catch(err){
    // console.error("Error creating post:", err); 
    return res.status(500).json({message:"Internal server error", });
   }
}

export const getAllPosts= async (req, res)=>{
    try {
        const posts = await Post.find({active:true}).populate('userId', 'name username email profilePicture');
        return res.json({posts});
    } catch (error) {
        return res.status(500).json({message:"Internal server error", });
    }
}

export const deletePost= async (req, res)=>{
    const {token , postId}=req.body;

    try {
        const user=await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const post = await Post.findOne({_id:postId});
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(403).json({message:"You are not authorized to delete this post"});
        }
        await Post.deleteOne({_id:postId});
        return res.status(200).json({message:"Post deleted successfully"});

    } catch (error) {
       return res.status(500).json({message:"Internal server error", }); 
    }
}

export const get_comments_by_post= async (req, res)=>{
    const {postId}=req.query;
    try {
        // console.log("Fetching comments for post ID:", postId);
        const post = await Post.findOne({_id:postId});
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        const comments = await Comment.find({postId:post._id}).populate('userId', 'userId username name profilePicture');
        return res.json({comments:comments.reverse(), postId:post._id}); 
    } catch (error) {
        return res.status(500).json({message:"Internal server error", });
    }
}

export const commentPost= async (req, res) => { 
  const { token, postId, comment } = req.body;
  try {
    
    const user=await User.findOne({token:token}).select("_id");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const post =await Post.findOne({_id:postId});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }

    const comments=new Comment({
      userId:user._id,
      postId:post._id,
      commentbody:comment
    });
    await comments.save();
    // post.comments.push(comments._id);

    return res.status(200).json({message:"Comment added successfully"});

  } catch (error) {
    return res.status(500).json({message:"Server error"});
  }
}

export const delete_comment_of_user= async (req, res)=>{
    const {token , comment_id}=req.body;
    try {
        const user=await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const comment=await Comment.findOne({"_id":comment_id});
        if(!comment){
            return res.status(404).json({message:"Comment not found"});

        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(403).json({message:"You are not authorized to delete this comment"});
        }
        await Comment.deleteOne({_id:comment_id});
        return res.status(200).json({message:"Comment deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:"Internal server error", });
        
    }
}

export const increment_like= async (req, res)=>{

    const {token , postId}=req.body;
    // console.log(postId);
    try {
        const post=await Post.findOne({_id:postId});
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        post.likes=post.likes+1;
        await post.save();
        return res.status(200).json({message:"Post liked successfully", post});
    } catch (error) {
        return res.status(500).json({message:"Somthing Went wrong"})
    }
}
