const {default: axios} = require("axios");


export const BASE_URL = "https://proconnectedlinkedinclone.onrender.com";
export const clientServer = axios.create({
     baseURL:  BASE_URL,
    headers:{
        "Content-Type":"application/json", 
        "Accept":"application/json"
    }
})