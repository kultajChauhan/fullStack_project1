import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import db from './utils/db.js'

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

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/kultaj", (req, res) => {
  res.send("Hello Kultaj!");
});

//connect db
db();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
