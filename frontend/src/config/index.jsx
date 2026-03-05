const {default: axios} = require("axios");


export const BASE_URL = "http://localhost:5000";
export const clientServer = axios.create({
     baseURL:  BASE_URL,
    headers:{
        "Content-Type":"application/json", 
        "Accept":"application/json"
    }
})