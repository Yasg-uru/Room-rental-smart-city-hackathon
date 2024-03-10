import express from "express"
import { addreview } from "../controllers/Review.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
const router=express.Router();
router.route("/addreview/:propertyid").post(isAuthenticated,addreview);
router.route("")
export default router;
