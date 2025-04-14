import express from "express";
import {
  registerUser,
  verifyUser,
  login,
} from "../controller/User.controller.js";

let router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);

export default router;
