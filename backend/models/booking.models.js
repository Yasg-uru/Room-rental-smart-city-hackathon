import mongoose, { Schema, model } from "mongoose";
const bookingSchema = new Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    propertyid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    startdate: {
      type: Date,
      require: [true, "please select start date"],
    },
    enddate: {
      type: Date,
      require: [true, "please select end date"],
    },
    bookingstatus: {
      type: String,
    },
    bookingid:{
      type:String,
      
    }
  },
  {
    timestamps: true,
  }
);
const bookingmodel=model("Booking",bookingSchema)
export default bookingmodel;