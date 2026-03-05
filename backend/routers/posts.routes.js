import express, { Router } from 'express';
import { activeCheck ,creatPost, getAllPosts,deletePost
    ,get_comments_by_post, delete_comment_of_user, increment_like,
    commentPost}
 from '../controllers/posts.controllers.js';
import multer from 'multer';
import { get } from 'mongoose';

const router = express.Router();

// router.route('/').get(activeCheak);

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname) // ✅ Use file.originalname
    },
})

const upload = multer({storage:storage});
router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"),creatPost);
router.route("/posts").get(getAllPosts);
router.route("/comments").post(commentPost);
router.route("/delete_post").delete(deletePost);
router.route("/get_comments_by_postId").get(get_comments_by_post);
router.route("/delete_comment_of_user").post(delete_comment_of_user);
router.route("/increment_like").post(increment_like);



export default router;
// Compare this snippet from backend/controllers/posts.controllers.js: