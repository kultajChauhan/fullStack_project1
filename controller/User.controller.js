import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const registerUser = async (req, res) => {
  // get data
  let { name, email, password } = req.body;

  try {
    //validate
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "All field are required",
      });
    }

    // check if user already exists
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({
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
      return res.status(200).json({
        message: "User not registered",
      });
    }

    //create a verification token
    let token = crypto.randomBytes(32).toString("hex");

    // save token in database
    newUser.verificationToken = token;
    await newUser.save();

    console.log(token);
    console.log(newUser);

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
    console.log("hello!");
    // send success status to user
    return res.status(200).json({
      message: "User Registered Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "User Not Registered Successfully",
      success: false,
    });
  }
};

let verifyUser = async (req, res) => {
  //get token from url
  let { token } = req.params;

  //validate
  if (!token) {
    res.json({
      message: "token not found",
    });
  }

  // find user based on token
  let user = await User.findOne({ verificationToken: token });
  // console.log(user)

  //if not
  if (!user) {
    res.status(400).json({
      message: "token is unvalid",
    });
  }

  // set isVerified field to true
  user.isVerified = true;

  // remove verification token
  user.verificationToken = null;

  // save
  await user.save();

  //return response
  res.status(200).json({
    message: "user is verified",
  });
};

let login = async (req, res) => {
  //get email,password
  let { email, password } = req.body;

  //check all fiel required
  if (!email || !password) {
    return res.status(400).json({
      message: "All field required",
    });
  }
  // console.log({ email, password });

  try {
    //get user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    // console.log({ user });

    //check password
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //ckeck user is verified or not
    if(!user.isVerified==true){
      return res.status(400).json({
        message: "user in not verified",
      });
    }

    // return res.status(200).json({
    //   message: "Login successfull",
    // });

   let jwtToken = jwt.sign({id:user._id},'shhhhh',{expiresIn:'24h'});

   let cookieOption={
    httpOnly:true,
    secure:true,
    maxAge:24*60*60*1000
   }
    console.log("hello!")
  res.cookie("token",jwtToken,cookieOption)

   return res.status(200).json({
    success:true,
    message:'Login successfull',
    jwtToken,
    user:{
      id:user._id,
      name:user.name,
      role:user.role,
    }
   })

  } catch (error) {
    // console.error("Error during login:", error);
    // return res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, verifyUser, login };
