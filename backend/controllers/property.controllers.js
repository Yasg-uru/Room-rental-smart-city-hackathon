import propertymodel from "../models/property.models.js";
import catchasyncerrors from "../middlewares/CatchAsyncErrors.middlewares.js";

import Errorhandler from "../utils/Errorhandler.utils.js";
export const createproperty = catchasyncerrors(async (req, res, next) => {
  try {
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      capactiy,
      pricePerMonth,
      availablestartdate,
      availablityenddate,
    } = req.body;
    const property = await propertymodel.create({
      title,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude,latitude] || [0, 0],
      },
      capactiy,
      pricePerMonth,
      availablestartdate,
      availablityenddate,
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      message: "product created successfully",
      property,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});
export const filtersearch = catchasyncerrors(async (req, res, next) => {
  const { minprice, maxprice, mincapacity, maxcapacity } = req.query;
  const filter = {
    pricePerMonth: { $gte: minprice || 0, $lte: maxprice || Infinity },
    capactiy: { $gte: mincapacity || 0, $lte: maxcapacity || Infinity },
  };
  const filteredres = await propertymodel.find(filter);
  res.status(200).json({
    success: true,
    message: "filtered successfully",
    filteredres,
  });
});
export const getpropertydetails = catchasyncerrors(async (req, res, next) => {
  try {
    //now we will implementing pagination on this api controller
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const searchterm = req.query.searchterm;
    const regexsearch = new RegExp(searchterm, "i");
    const searchquery = searchterm
      ? {
          $or: [
            { title: { $regex: regexsearch } },
            { description: { $regex: regexsearch } },
            { capacity: { $regex: regexsearch } },
            { pricePerMonth: { $regex: regexsearch } },
            { address: { $regex: regexsearch } },
          ],
        }
      : {};
    const property = await propertymodel
      .find(searchquery)
      .skip((page - 1) * limit)
      .limit(limit);
    if (!property) {
      return next(new Errorhandler("property not exist!", 404));
    }
    let totalpages = searchterm
      ? propertymodel.countDocuments(searchquery)
      : propertymodel.countDocuments();

    let hasnextpage = page < Math.ceil(totalpages / limit);
    res.status(200).json({
      success: true,
      message: "properties accessed successfully",
      property,
      hasnextpage,
    });
  } catch (error) {}
});

export const deleteproperty = catchasyncerrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    let property = await propertymodel.findById(id);
    if (!property) {
      return next(new Errorhandler("property not found ", 404));
    }
    property = await propertymodel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "property deleted successfully",
      property,
    });
  } catch (error) {
    return next(new Errorhandler(error?.message, 500));
  }
});
export const searchpropertiesbylocation = catchasyncerrors(
  async (req, res, next) => {
    try {
      const { longitude, latitude, distance } = req.body;

      const maxdistance = distance ? parseInt(distance) * 1000 : 500;

      const searchterm = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: maxdistance,
          },
        },
      };
      const properties = await propertymodel.find(searchterm);
      if (!properties) {
        return next(new Errorhandler("properties not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "fetched successfully",
        properties,
      });
    } catch (error) {
      return next(new Errorhandler(error?.message, 500));
    }
  }
);
export const addfavourate = catchasyncerrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const property = await propertymodel.findById(id);
    if (!property) {
      return next(new Errorhandler("property not found ", 404));
    }
    user.favourates.push(property._id);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Added to favourates",
    });
  } catch (error) {
    return next(new Errorhandler(error?.message, 404));
  }
});
export const removefromfavourates = catchasyncerrors(async (req, res, next) => {
  try {
    const { propertyid } = req.params;
    const { user } = req;
    const property = await propertymodel.findById(propertyid);
    if (!property) {
      return next(new Errorhandler("property not found", 404));
    }
    // user.favourates = user.favourates.filter((id) => {
    //   return id.toString() !== propertyid;
    // });
    user.favourates.pull(property._id)
    await user.save();
    res.status(200).json({
      success: true,
      message: "removed from favourates",
    });
  } catch (error) {
    return next(new Errorhandler(error?.message, 500));
  }
});
export const getpropertystatus = catchasyncerrors(async (req, res, next) => {
  try {
    const status = await propertymodel.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$reviews.rating" },
          totalProperties: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      status: status[0],
    });
  } catch (error) {
    return next(new Errorhandler(error?.message, 500));
  }
});
