import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../index";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get("/posts");
      //    console.log("Posts fetched successfully:", response.data.posts);
      return thunkApi.fulfillWithValue(response.data.posts);
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data || "Failed to fetch posts, please try again."
      );
    }
  }
);
export const createPost = createAsyncThunk(
  "post/createPost",
  async (postData, thunkApi) => {
    const { file, body } = postData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.post) {
        return thunkApi.fulfillWithValue(response.data.post);
      } else {
        return thunkApi.rejectWithValue(
          "Failed to create post, please try again."
        );
      }
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data || "Failed to create post, please try again."
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post, thunkApi) => {
    try {
      // console.log("Deleting post with ID:", post.token, post.postsId);
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          postId: post.postsId,
        },
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (err) {
      return thunkApi.rejectWithValue(err.response.data);
    }
  }
);

export const likePost = createAsyncThunk(
  "post/incrementLikes",
  async (post, thunkApi) => {
    console.log(post.post_id);
    try {
      const response = await clientServer.post("/increment_like" , {
        postId:post.post_id
      })
      return response.fulfillWithValue((response.data));
      console.log(response.data);
    } catch (err) {
      return thunkApi.rejectWithValue(
        err.response.data || "Failed to like post, please try again."
      );
    }
  }
);

export const getAllcommentPost = createAsyncThunk(
  "posts/commentPost",
  async (commentData, thunkApi)=>{
    try{
       const response = await clientServer.get("get_comments_by_postId", {
    
          params: {
            postId: commentData.postId
          }
        
       })
       return thunkApi.fulfillWithValue(
         response.data,{
        postId: commentData.postId,
       });
    }catch(err){
      return thunkApi.rejectWithValue(
        err.response.data || "Failed to comment on post, please try again."
      );
    }
  }
)

export const commentPOst = createAsyncThunk(
  "posts/commentPOst",
  async (commnetsData, thunkApi)=>{
    try{
      const response = await clientServer.post("/comments", {
        token: localStorage.getItem("token"),
        postId: commnetsData.postId,
        comment: commnetsData.comment,
      });
      return thunkApi.fulfillWithValue(response.data.message);
    }catch(err){
      return thunkApi.rejectWithValue(
        err.response.data || "Failed to comment on post, please try again."
      );
    }
  }
);

