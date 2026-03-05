import User from "../models/users.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import bcrypt from "bcryptjs";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import PDFDoc from "pdfkit";
import fs from "fs";
import ConnectionReqeust from "../models/connection.model.js";
import { connect } from "http2";
import jwt from "jsonwebtoken";
// import { height } from "pdfkit/js/page";

const convertUserDataToPDF = async (userData) => {
  try {
    // console.log("Converting user data to PDF for user:", userData);
    const doc = new PDFDoc();
    const fileName = `user_data_${Date.now()}.pdf`;
    // const filePath = `./uploads/${fileName}`;
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const Stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(Stream);
    doc.moveUp(3.3);
    doc.image(`uploads/${userData.userId.profilePicture}`, {
      align: "center",
      width: 100,
    });
    doc.moveDown(7.5);
    doc.fontSize(14).text(`Name:${userData.userId.name}`);
    doc.fontSize(14).text(`Username:${userData.userId.username}`);
    doc.fontSize(14).text(`Email:${userData.userId.email}`);
    doc.fontSize(14).text(`Bio:${userData.bio}`);
    doc.fontSize(14).text(`currentPosition:${userData.userId.currentPosition}`);

    doc.fontSize(14).text("pastWork:");
    userData.pastPost.forEach((work, index) => {
      doc.fontSize(14).text(`Company:${work.companyName}`);
      doc.fontSize(14).text(`Position:${work.position}`);
      doc.fontSize(14).text(`Years:${work.years}`);
    });
    doc.end();
    return outputPath;
  } catch (error) {
    return error.message;
  }
};

const resister = async (req, res) => {
  try {
    // console.log("Registering user with details:", req.body);
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res
        .status(404)
        .json({ message: "Email or username already exist" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      name,
      username,
      email,
      password: passwordHash,
      token,
    });
    await newUser.save();
    const profile = new Profile({ userId: newUser._id, bio: "" });
    await profile.save();
    return res.status(200).json({ message: "User created successfully" , token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    // console.log("keshav")
    const { email, password } = req.body;
    if (!email || !password) {
      // console.log("ajskjkdjak please")
      return res.status(400).json({ message: "All field are required" });
    }
    // console.log("Login attempt with email:", email);
    const user = await User.findOne({ email });
    // console.log(user.password);
    // console.log(password , "<-->", email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }
    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token: token });
    return res.json({ token });
    // console.log("User logged in successfully");
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateProfile_picture = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // await Profile.updateOne({userId:req.user._id},{profile_picture:file.filename});
    user.profilePicture = req.file.filename;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// const user_update= async (req,res)=>{
//     try {
//         const {token}=req.body;
//         const user=await User
//         .findOne({token:token});
//         if(!user){
//             return res.status(404).json({message:"User not found"});
//         }
//         const {name,username,email}=req.body;
//         if(name){
//             user.name=name;
//         }
//         if(username){
//             user.username=username;
//         }
//         if(email){
//             user.email=email;
//         }
//         await user.save();
//         return res.status(200).json({message:"User updated successfully"})
//     }
//     catch (error) {
//         return res.status(500).json({message:"Server error"})
//     }
// }

const update_user_profile = async (req, res) => {
  try {
    const { token} = req.body;
    console.log("Token received for profile update:");
    console.log("Token received for profile update:", req.body);
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // const { username, email } = newUserData;
    // const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    // if (existingUser || existingUser._id.toString() != user._id.toString()) {
    //   return res
    //     .status(400)
    //     .json({ message: "Username or email already exist" });
    // }
    // Object.assign(user, newUserData);
    if(user){
      console.log("this is ",user)
    }
    // await user.save();
    return res
      .status(200)
      .json({ message: "username or email updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const get_user_and_profile = async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    // console.log(token);

    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
    await profile.save();
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const updateProfileData = async (req, res) => {
  try {
    // console.log("updateProfileData called with data:", req.body);
    const { token,name, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    // console.log("User found for profile update:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("User data before update :", user);
    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    // console.log("Profile found for update:", profile);
    // ✅ Update User collection (for name)
    // console.log("New user data for update:", newUserData);
    if (name) {
      user.name = name;
      await user.save();
    }
    // console.log("User data after name update:", user.name, "profile userId name:", name);
    Object.assign(profile, newUserData);
    // console.log("user DAta" ,newUserData , "profile is" , profile);
    await profile.save();
    // console.log("Profile data after update:", profile );
    console.log("Profile updated successfully 23123");
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    // console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
    
  }
};

const getAllUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    if (!profiles) {
      return res.status(404).json({ message: "Profiles not found" });
    }
    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const downloadProfile = async (req, res) => {
  try {
    const user_Id = req.query.id;
    const userData = await Profile.findOne(user_Id).populate(
      "userId",
      "name username email profilePicture"
    );
    let a = await convertUserDataToPDF(userData);

    return res.json({ message: "PDF created successfully", filePath: a });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Server error , your actual error:- ${error.message}` });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
   
    const { token, userId } = req.body
    //  console.log("sendConnectionRequest called", token, "ssaa", userId);
     const connectionId = userId;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser=await User.findOne({_id:connectionId});
    if(!connectionUser){
      return res.status(404).json({message:"Connection user not found"});
    }


    const existingRequest= await ConnectionReqeust.findOne({
      senderId:user._id,
      receiverId:connectionUser._id,
    });

    if(existingRequest){
      return res.status(400).json({message:"Connection request already sent"});
    }
    const connectionRequest = new ConnectionReqeust({
      senderId: user._id,
      receiverId: connectionUser._id,
    });
    await connectionRequest.save();
    return res.status(200).json({ message: "Connection request sent" });
  }catch (error) {
    return res.status(500).json({ message: "Server error" });
    
  }
}

const getMyConnectionsRequest = async (req, res) => {
  const { token } = req.query;

  try{
    const user = await User.findOne({ token: token });
    // console.log("User found:", token);
    if(!user){
      return res.status(404).json({message:"User not found"});

    }
    const connectionRequests = await ConnectionReqeust.find({senderId:user._id}).
    populate("senderId","name username email profilePicture");
    if(!connectionRequests){
      return res.status(404).json({message:"No connection requests found"});
    }
    // console.log("Connection Requests:", connectionRequests);
    return res.status(200).json({connectionRequests});
  

  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
}
// getMyConnectionsRequest({token:"2d2f20c2b4cc3de1400b03251c5d911d7fa88b5f15d47f42a9468f57d22708b5"});

const whatAreMyConnections = async (req, res) => {
  const   { token } = req.query;
  // console.log("whatAreMyConnections called with token:", token);

  try{
    const user = await User.findOne({ token: token });
    if(!user){
      return res.status(404).json({message:"User not found"});

    }
    const connections = await ConnectionReqeust.find({receiverId:user._id}).
    populate("senderId","name username email profilePicture");
    if(!connections){
      return res.status(404).json({message:"No connections found"});
    }
    return res.status(200).json({connections});
  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
}

const acceptConnectionRequest = async (req, res) => {
  const { token, connectionId, accepted_status } = req.body;
  console.log("acceptConnectionRequest called with data:", req.body);

  try{
    // console.log("Inside try block of acceptConnectionRequest");
       const user= await User.findOne({token:token});
      //  console.log("User found:", user);
       if(!user){
        return res.status(404).json({message:"User not found"});
       }
      //  console.log("Finding connection request with ID:", connectionId);
       const connection = await ConnectionReqeust.findOne({_id:connectionId});
      //  console.log("Connection request found:", connection);
       if(!connection){
        return res.status(404).json({message:"Connection request not found"});
       }
       if(accepted_status==="accept"){
        connection.status=true;
       }else{
        connection.status=false;
       }

        await connection.save();
        return res.status(200).json({message:"Connection request updated successfully"});

  }catch{
    return res.status(500).json({message:"Server error"});
  }
}

const getUserProfileAndBaseOnUsername = async (req, res)=>{
  const { username } = req.query;
  console.log("getUserProfileAndBaseOnUsername called with username:", username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ profile });
  }catch(err){
    return res.status(500).json({ message: "Server error" });
  }
}


export {
  resister,
  login,
  updateProfile_picture,
  update_user_profile,
  get_user_and_profile,
  updateProfileData,
  getAllUsersProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
  getUserProfileAndBaseOnUsername
};
