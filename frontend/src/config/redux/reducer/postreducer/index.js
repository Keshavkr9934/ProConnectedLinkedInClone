import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts , createPost,deletePost,
    likePost,
    getAllcommentPost,
    commentPOst,
} from "../../action/postAction/index.js";


const initialState = {
    posts: [],
    isError: false,
    postFeched: false,
    isLoading: false,
    loggedIn :false,
    message: "",
    comments: [],
    postId: "",
    likes:0
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId : (state)=>{
            state.postId = "";
        },

    },
    extraReducers : (builder)=>{
        builder
        .addCase(getAllPosts.pending, (state)=>{
            state.isLoading = true;
            state.message = "Fetching all the posts ...";
        })
        .addCase(getAllPosts.fulfilled, (state, action)=>{
            // console.log("Fetched posts payload:", action.payload);
            state.isLoading = true;
            state.isError = false;
            state.postFeched = true;
            state.posts = action.payload.reverse();
            state.message = action.payload.message;
        })
        .addCase(getAllPosts.rejected, (state, action )=>{
            state.isLoading = false;
            state.isError = true;
            state.postFeched = false;
            state.message = action.payload || "Something went wrong";

        })
        .addCase(createPost.pending, (state)=>{
            state.isLoading = true;
            state.message = "Creating post ...";
        })
        .addCase(createPost.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.message = "Post created successfully!";
        })
        .addCase(createPost.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message || "Failed to create post, please try again.";
        })
        .addCase(deletePost.pending, (state)=>{
            state.isLoading = true;
            state.message = "Deleting post ...";
        })
        .addCase(deletePost.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.message = "Post deleted successfully!";
            // Remove the deleted post from the posts array
            state.posts = state.posts.filter(post => post._id !== action.payload._id);
        })
        .addCase(deletePost.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message || "Failed to delete post, please try again.";
        })
        .addCase(likePost.fulfilled , (state, action)=>{
             state.message= "Post liked successfully";
             state.isError=false;
             state.isLoading=false;
             state.likes=action.payload.likes;

        })
        .addCase(getAllcommentPost.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.message = "Comment added successfully!";
            state.postId = action.payload.postId;
            // Add the new comment to the post's comments array
            // const postIndex = state.posts.findIndex(post => post._id === action.payload.postId);
            // if (postIndex !== -1) {
            //     state.posts[postIndex].comments.push(action.payload.comment);
            // }
            state.comments = action.payload;
        })
        .addCase(commentPOst.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.message = "Comments fetched successfully!";
            // state.comments = action.payload.comments;
            state.postId = action.payload.postId;
        })
        .addCase(commentPOst.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch comments, please try again.";
        })
        .addCase(getAllcommentPost.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch comments, please try again.";
        })
        .addCase(getAllcommentPost.pending, (state)=>{
            state.isLoading = true;
            state.message = "Fetching comments ...";
        })
        
    }
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;