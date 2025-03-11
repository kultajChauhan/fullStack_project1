import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

let db = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("Data base connected");
    })
    .catch(() => {
      console.log("Data base not connected");
    });
};

export default db;