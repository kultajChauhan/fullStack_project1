import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    email: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", userSchema);

export default User;
