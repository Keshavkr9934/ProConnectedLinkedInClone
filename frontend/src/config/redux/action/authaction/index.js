import { createAsyncThunk } from "@reduxjs/toolkit";
import {clientServer} from "../../../index";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkApi)=>{
        try{
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });
            if(response.data.token){
                localStorage.setItem("token", response.data.token);
            }else{
                return thunkApi.rejectWithValue("Login failed, please try again.");
            }
            return thunkApi.fulfillWithValue(response.data);
        }catch(error){
           return thunkApi.rejectWithValue(error.response.data);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkApi)=>{
        // console.log("Registering user");
        try{
            // console.log("🔥 registerUser THUNK called");
              const response = await clientServer.post("/register", {
                name: user.name,
                username:user.username,
                email: user.email,
                password: user.password
              })
              if(response.data.token){
                localStorage.setItem("token", response.data.token);
            }else{
                return thunkApi.rejectWithValue("Login failed, please try again.");
            }
            //   console.log("Response from registration:", response.data);
              return thunkApi.fulfillWithValue(response.data);

        }catch(err){
            // console.error("Error during registration: ksjfhsghjshg");
           return thunkApi.rejectWithValue(err.response.data || "Registration failed, please try again.");
        }
    }
)

export  const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkApi)=>{
        try{
            const response = await clientServer.get("/get_user_and_profile" , {
                params: {
                    token: user.token
                }
            });

            return thunkApi.fulfillWithValue(response.data);
            

        }catch(err){
            return thunkApi.rejectWithValue(err.response.data || "Failed to fetch user data, please try again.");
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_ , thunkApi)=>{
        try{
            const response = await clientServer.get("/user/get_All_Users_Profile");
            return thunkApi.fulfillWithValue(response.data);

        }catch(err){
            return thunkApi.
            rejectWithValue
            (err.response.data ||
                 "Failed to fethch all users, please try again. ");
        }
    }
)
export  const getMyConnectionsRequest = createAsyncThunk(
  "user/getMyConnectionsRequest",
  async (user, thunkApi)=>{
        try{
            // console.log("Thunk called with token:", user.token);
            const response = await clientServer.get("/user/get-connection_request" , {
                params: {
                    token: user.token
                }
            });
            // console.log("Response in thunk:", response.data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data || "Failed to fetch connection requests, please try again.");
        }   
    }
);

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (connectionData, thunkApi)=>{
        try{
            // console.log("Sending connection request to userId:", connectionData.userId);
            const response = await clientServer.post("/user/send_connection_request" , {
                token: connectionData.token,
                userId: connectionData.userId
            });
            thunkApi.dispatch(getMyConnectionsRequest({token: connectionData.token}));
            return thunkApi.fulfillWithValue(response.data);
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data || "Failed to send connection request, please try again.");
        }
    }
);
export const whatAreMyConnections = createAsyncThunk(
    "user/whatAreMyConnections",
    async (user, thunkApi)=>{
        try{
            // console.log("Fetching connections with token:", user.token);
            const response = await clientServer.get("/user/user_connection_request" , {
                params: {   
                    token: user.token
                }
            });
            // console.log("Connections fetched:", response.data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data || "Failed to fetch connections, please try again.");
        }
    }
);
export const acceptConnectionRequest = createAsyncThunk(
    "user/acceptConnectionRequest",
    async (data, thunkApi)=>{
        try{
            console.log("Accepting connection request with data:", data);
            const response = await clientServer.post("/user/accept_connection_request" , {
                token: data.token,
                connectionId: data.connectionId,
                accepted_status: data.accepted_status
            });
            thunkApi.dispatch(whatAreMyConnections({token: data.token}));
            console.log("Connection request accepted:", response.data);
            return thunkApi.fulfillWithValue(response.data);
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data || "Failed to accept connection request, please try again.");
        }
    }
);
export const getUserAndProfile = createAsyncThunk(
    "user/getUserAndProfile",
    async (user, thunkApi)=>{
        try{
            const response = await clientServer.get("/get_user_and_profile" , {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            //  console.log("User and profile data fetched:", response.data);
            return thunkApi.fulfillWithValue(response.data);
           
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data || "Failed to fetch user data, please try again.");
        }
    }
);