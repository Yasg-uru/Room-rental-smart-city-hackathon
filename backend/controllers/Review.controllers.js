import catchasyncerrors from "../middlewares/CatchAsyncErrors.middlewares.js";
import propertymodel from "../models/property.models.js";
import Errorhandler from "../utils/Errorhandler.utils.js";

export const addreview = catchasyncerrors(async (req, res, next) => {
//   try {
    const { propertyid } = req.params;
    const { ratings, addcomment } = req.body;
    const { user } = req;
    // images we will add the cloudinary functionality later
    const property = await propertymodel.findById(propertyid);
    if (!property) {
      return next(new Errorhandler("property not found", 404));
    }
    property.reviews.push({
      givenby:user._id,
      ratings:ratings,
      addcomment:addcomment
    })

    await property.save();
    res.status(200).json({
      success: true,
      message: "your review added successfully",
      property,
    });
//   } catch (error) {
//     return next(new Errorhandler(error?.message, 500));
//   }
});
export const deletereview = catchasyncerrors(async (req, res, next) => {
  try {
    const { propertyid } = req.params;
    const { user } = req;
    const property = await propertymodel.findById(propertyid);
    if (!property) {
      return next(new Errorhandler("property not found", 404));
    }
    property.reviews = property.reviews.filter((review) => {
      return review.givenby.toString() !== user._id;
    });
    await property.save();
    res.status(200).json({
      success: true,
      message: "review deleted successfully",
      property,
    });
  } catch (error) {
    return next(new Errorhandler(error?.message, 500));
  }
});

