import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({


    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    status: { 
        type: Boolean, 
        default: null,
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

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;