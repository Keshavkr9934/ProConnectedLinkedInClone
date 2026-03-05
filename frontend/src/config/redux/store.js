import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/reducer/authreducer/index.js';
import postReducers from "../redux/reducer/postreducer/index.js"

// steps for state management
 // submit action
 // handle action in it's reducer
 //register here --->reducer

 export const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postReducers
    }
 })

