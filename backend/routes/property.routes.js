import express from "express"
import { addfavourate, createproperty, deleteproperty, filtersearch, getpropertydetails, getpropertystatus, removefromfavourates, searchpropertiesbylocation } from "../controllers/property.controllers.js";
import { authorization, isAuthenticated } from "../middlewares/auth.middlewares.js";
const router=express.Router();
router.route("/createproperty").post(isAuthenticated,createproperty)
router.route("/getpropertydetails").get(isAuthenticated,getpropertydetails)
router.route("/deleteproperty").delete(isAuthenticated,authorization("admin"),deleteproperty);
router.route("/filter").get(isAuthenticated,filtersearch);
router.route('/saerchbylocation').get(isAuthenticated,searchpropertiesbylocation)
router.route("/addfav/:id").post(isAuthenticated,addfavourate);
router.route("/removefav/:propertyid").delete(isAuthenticated,removefromfavourates)
router.route("/getstatus").get(isAuthenticated,getpropertystatus);
export default router;
