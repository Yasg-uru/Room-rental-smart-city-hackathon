import express from "express"
import {createuser, login, logout} from "../controllers/user.controllers.js"
import upload from "../middlewares/multer.middlewares.js"
const router=express.Router();
router.route('/register').post(upload.single("profilePicture"),createuser);
router.route('/login').post(login);
router.route("/logout").post(logout)
export default router;
