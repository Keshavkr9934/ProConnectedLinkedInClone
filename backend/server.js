import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import path from 'path';
// import bcrypt from 'bcryptjs';
// import multer from 'multer';
// import pdf-creator-node from 'pdf-creator-node';
// import postRoutes from './routers/posts.routes.js';
import userRoutes from './routers/users.routes.js';
import postRoutes from './routers/posts.routes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// app.use(postRoutes);
app.use(userRoutes);
app.use(postRoutes);
app.use(express.static('uploads'));


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`server started on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
};

start();