import express from 'express'
import { register } from '../controller/User.controller.js';

let router=express.Router();

router.get('/register',register)

export default router;