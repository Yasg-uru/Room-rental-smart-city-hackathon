import express from "express"
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { bookproperty, verifyorder } from "../controllers/propertybooking.controllers.js";

const router=express.Router();
router.route("/book/:propertyid").post(isAuthenticated,bookproperty)
router.route("/verfiyorder").post(isAuthenticated,verifyorder)
export default router;