import User from "../models/user.models.js";
import catchasyncerror from "../middlewares/CatchAsyncErrors.middlewares.js";
import sendtoken from "../utils/sendToken.utils.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import uploadcloudinary from "../utils/cloudinary.utils.js";
export const createuser = catchasyncerror(async (req, res, next) => {
  const { name, password, email } = req.body;

  const cloudinary = await uploadcloudinary(req.file.path);
  const profilePicture = cloudinary.secure_url;
  const user = await User.create({
    name,
    email,
    password,
    profilePicture,
  });

  //we will add a cloudinary functionality to uppload a profile picture
  sendtoken(user, res, 200);
});
export const login = catchasyncerror(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Errorhandler("invalid email or password", 404));
    }
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return next(new Errorhandler("user not found with this email", 404));
    }
    let comparedpass = await user.comparePassword(password);
    if (!comparedpass) {
      return next(new Errorhandler("invalid email or password", 404));
    }
    sendtoken(user, res, 200);
  } catch (error) {
    return next(new Errorhandler("internal server error", 500));
  }
});
export const logout = catchasyncerror(async (req, res, next) => {
  await res.cookie("token", null, {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logout sucessfully",
  });
});
