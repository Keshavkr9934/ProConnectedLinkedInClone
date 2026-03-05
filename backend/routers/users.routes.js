import express from 'express';
import {resister,login,updateProfile_picture, update_user_profile,get_user_and_profile,
    updateProfileData,
    getAllUsersProfile,
    downloadProfile,
    sendConnectionRequest,
    getMyConnectionsRequest,
    whatAreMyConnections,
    acceptConnectionRequest,
    getUserProfileAndBaseOnUsername
} from '../controllers/users.controllers.js';
import multer from 'multer';
import { get } from 'mongoose';


const Router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // ✅ Use file.originalname
    },
});


const upload = multer({ storage: storage })
Router.route('/updateProfile_picture').post(upload.single("file"),updateProfile_picture);
Router.route('/register').post(resister);
Router.route('/login').post(login);
// Router.route("/user_update").put(user_update);
Router.route("/update_user_profile").put(update_user_profile);
Router.route("/get_user_and_profile").get(get_user_and_profile);
Router.route("/updateProfileData").post(updateProfileData);
Router.route("/user/get_All_Users_Profile").get(getAllUsersProfile);
Router.route("/user/download_resume").get(downloadProfile);
Router.route("/user/send_connection_request").post(sendConnectionRequest);
Router.route("/user/get-connection_request").get(getMyConnectionsRequest);
Router.route("/user/user_connection_request").get(whatAreMyConnections);
Router.route("/user/accept_connection_request").post(acceptConnectionRequest);
Router.route("/user/get_user_profile_and_base_on_username").get(getUserProfileAndBaseOnUsername);


export default Router;