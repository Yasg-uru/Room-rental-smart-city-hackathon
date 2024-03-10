import Errorhandler from "../utils/Errorhandler.utils.js";
import catchasyncerrors from "./CatchAsyncErrors.middlewares.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = catchasyncerrors(async (req, res, next) => {
  const token = req.cookies.token;
  console.log("token  is :"+token)
  if (!token) {
    return next(new Errorhandler("please login to continue", 404));
  } 
    try {
      let decodeddata = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodeddata.id);
      return next();
    } catch (error) {
      return next(
        new Errorhandler("error is occured in authentication middleware")
      );
    
  }
});

export const authorization = function (...roles) {
 return (req,res,next)=>{
  if (!roles.includes(req.user.role)) {
    return next(
      new Errorhandler(
        `${req.user.role} is not allowed to access this resources`
      )
    );
  }
  next();
 }
};
