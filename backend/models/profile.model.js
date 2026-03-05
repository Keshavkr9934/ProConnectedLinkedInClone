import mongoose from "mongoose";

const educationSchema = mongoose.Schema({   
    school: {
         type: String, 
         required: true 
        },
    degree: { 
        type: String, 
        required: true 
    },
    fieldOfStudy: {
         type: String, 
         required: true 
        },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { 
        type: Date,
        default: Date.now
    }
});

const workSchema = mongoose.Schema({   
    company: {
         type: String, 
         required: true 
        },
    position: { 
        type: String, 
        required: true 
    },
    years:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { 
        type: Date,
        default: Date.now
    }
});

const profileSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    bio: { 
        type: String, 
        default: ''
    },
   currentPost:{
         type: String,
            default: ''
   },
   pastPost:{
        type: [workSchema],
        default: []
   },
    education:{
          type: [educationSchema],
          default: []
    },
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
