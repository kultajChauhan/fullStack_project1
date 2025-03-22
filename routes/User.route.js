import express from 'express'
import { registerUser,verifyUser } from '../controller/User.controller.js';

let router=express.Router();

router.post('/register',registerUser)
router.get('/verify',verifyUser)

export default router;