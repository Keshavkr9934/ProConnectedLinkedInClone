import { createSlice } from "@reduxjs/toolkit";
// import { init } from 'next/dist/compiled/webpack/webpack';
import { connect } from "react-redux";
import { loginUser, 
  registerUser,
  getAboutUser, getAllUsers } from "../../action/authaction/index.js";
import { getMyConnectionsRequest,
  sendConnectionRequest ,
  whatAreMyConnections ,
  acceptConnectionRequest,
  getUserAndProfile
} from "../../action/authaction/index.js";

const initialState = {
  userProfile: {},
  user: undefined,
  isError: false,
  isLoading: false,
  isSuccess: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFeched: false,
  connection: [],
  connectionRequest: [],
  all_profiles_feched:false,
  all_users:[],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => (state.message = "hello"),

    emptyMessage: (state) => {
      state.message = "";
    },
    setIsTokenThere: (state, action) => {
      state.isTokenThere = true;
    },
    notSetIsTokenThere: (state, action) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Logging in...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        // state.user = action.payload.user;
        state.message = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Login failed, please try again..";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload.user;
        state.message = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload || "Registration failed, please try again.";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        // state.loggedIn = true;
        state.user = action.payload.profile;
        state.profileFeched = true;
        state.message = "User data fetched successfully!";
      })
      .addCase(getAllUsers.fulfilled, (state , action)=>{
        state.isLoading = false;
        state.isError = false;
        state.all_users = action.payload.profiles;
        state.all_profiles_feched=true;
        state.message = "All users fetched successfully!";
      })
      .addCase(getAllUsers.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.all_profiles_feched=false;
        state.message = action.payload || "Failed to fetch all users, please try again.";
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.profileFeched = false;
        state.message =
          action.payload || "Failed to fetch user data, please try again.";
      }
      )
      .addCase(getMyConnectionsRequest.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.isError = false;
        // console.log("this is authslice debugger" ,action.payload.connectionRequests);
        state.connection = action.payload.connectionRequests;
        // console.log("this is authslice debugger state" ,connection);
        state.message = "Connection requests fetched successfully!";
      })
      .addCase(getMyConnectionsRequest.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch connection requests, please try again."; 
      } 
      )
      .addCase(getMyConnectionsRequest.pending, (state)=>{
        state.isLoading = true;
        state.message = "Fetching connection requests ...";
      }
      )
      .addCase(sendConnectionRequest.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.isError = false;
        state.message = "Connection request sent successfully!";
      })
      .addCase(sendConnectionRequest.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to send connection request, please try again.";
      })
      .addCase(sendConnectionRequest.pending, (state)=>{
        state.isLoading = true;
        state.message = "Sending connection request ...";
      })
      .addCase(whatAreMyConnections.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.isError = false;
        state.connectionRequest = action.payload.connections;
        state.message = "Connections fetched successfully!";
      })
      .addCase(whatAreMyConnections.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch connections, please try again.";
      })
      .addCase(whatAreMyConnections.pending, (state)=>{
        state.isLoading = true;
        state.message = "Fetching connections ...";
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.isError = false;
        state.message = "Connection request accepted successfully!";
      })
      .addCase(acceptConnectionRequest.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to accept connection request, please try again.";
      })
      .addCase(acceptConnectionRequest.pending, (state)=>{
        state.isLoading = true;
        state.message = "Accepting connection request ...";
      })
      .addCase(getUserAndProfile.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.isError = false;
        state.userProfile = action.payload.profile;
        state.message = "User and profile fetched successfully!";
      })
      .addCase(getUserAndProfile.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch user and profile, please try again.";
      });
  },
});
export const { reset, emptyMessage,setIsTokenThere, notSetIsTokenThere } = authSlice.actions;
export default authSlice.reducer;
