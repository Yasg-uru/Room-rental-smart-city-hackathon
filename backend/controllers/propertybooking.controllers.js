import Booking from "../models/booking.models.js";
import catchasyncerrors from "../middlewares/CatchAsyncErrors.middlewares.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import propertymodel from "../models/property.models.js";

import paymentmodel from "../models/payment.models.js";
import Razorpay from "razorpay";
import crypto from "crypto";
const razorpayinstance = new Razorpay({
  key_id: "rzp_live_tK7jKIBkQuTeH7",
  key_secret: "d3q0tkLxfFVKoizPqeboYYsm",
});
export const bookproperty = catchasyncerrors(async (req, res, next) => {
  try {
    const { propertyid } = req.params;
    const { user } = req;
    const { startdate, enddate } = req.body;
    const property = await propertymodel.findById(propertyid);
    if (!property) {
      return next(new Errorhandler("property not found ", 404));
    }
    const propertyAvailability = await property.checkAvailability(startdate);
    if (!propertyAvailability) {
      return next(
        new Errorhandler("property is not available at this start date", 404)
      );
    }
    const DurationInDays =
      Math.ceil(new Date(enddate) - new Date(startdate)) /
      (1000 * 60 * 60 * 24);
    const AmountforDays =
      Math.ceil(DurationInDays / 30) * property.pricePerMonth;
    const options = {
      // amount: 100,
      amount: AmountforDays,
      currency: "INR",
      receipt: "order_receipt_",
      payment_capture: 1,
    };

    const order = await razorpayinstance.orders.create(options);
    const booking = await Booking.create({
      userid: user._id,
      startdate,
      enddate,
      bookingstatus: order.status,
      bookingid: order.id,
    });
    res.status(200).json({
      success: true,
      message: "order created successfully",
      order,
    });
  } catch (error) {
    return next(new Errorhandler(error?.message, 500));
  }
});
export const verifyorder = catchasyncerrors(async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SCERET)
      .update(body.toString())
      .digest("hex");
    const isauthentic = expected_signature == razorpay_signature;
    if (isauthentic) {
      const payment = await paymentmodel.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      const booking = await Booking.find({ bookingid: razorpay_order_id });
      if (!booking) {
        return next(new Errorhandler("booking not found", 404));
      }
      booking.bookingstatus = "confirmed";
      await booking.save();

      res.status(200).json({
        success: true,
        message: "order payment verification successfull",
        payment,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "payment verification failed !",
      });
    }
  } catch (error) {
    return next(new Errorhandler(error?.message, 500));
  }
});
