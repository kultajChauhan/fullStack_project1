import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import db from './utils/db.js'
import cookieParser from "cookie-parser";

//import all routes
import userRouter from "./routes/User.route.js";

// dotenv.config()

const app = express();

app.use(
  cors({
    origin:process.env.BASE_URL,
    credentials:true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  console.log('cookie',res.cookie)
  res.send("Hello World!");
});

app.get("/kultaj", (req, res) => {
  res.send("Hello Kultaj!");
});

//connect db
db();

//user route
app.use('/api/v1/users',userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
