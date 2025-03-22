import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  // get data
  let { name, email, password } = req.body;

  try {
    //validate
    if (!name || !email || !password) {
      res.status(400).send({
        message: "All field are required",
      });
    }

    // check if user already exists
    let user = await User.findOne({email });
    if (user) {
      res.status(400).send({
        message: "User already exits",
      });
    }

    // create a user in database
    let newUser = await User.create({
      name,
      password,
      email,
    });

    if (!newUser) {
      res.status(200).send({
        message: "User not registered",
      });
    }

    //create a verification token
    let token = crypto.randomBytes(32).toString("hex");

    // save token in database
    newUser.verificationToken = token;
    await newUser.save();

console.log(token)
    console.log(newUser)


    // send token as email to user
    var transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    let mailOption = {
      from: process.env.MAILTRAP_EMAIL, // sender address
      to: newUser.email, // list of receivers
      subject: "Testing Email", // Subject line
      text: `Please click on the following link ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
    };

    await transport.sendMail(mailOption);
    console.log("hello!")
  } catch (error) {res.status(200).json({
    message:"User Not Registered Successfully",
    success:false
  });}

  // send success status to user
  res.status(200).json({
    message:"User Registered Successfully",
    success:true
  });
};

let verifyUser = async (req, res) => {};

export { registerUser, verifyUser };
