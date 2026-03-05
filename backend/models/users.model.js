import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"dfault.jpg"
    },
    active:{
        type:Boolean,
        default:true
    },
    creatAt:{
        type:Date,
        default:Date.now
    }
    ,token:{
        type:String,
        default:""
    }
})

const User=mongoose.model('User',userSchema);
export default User;