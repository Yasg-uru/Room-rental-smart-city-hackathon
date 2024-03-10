import mongoose, { Schema, model } from "mongoose";

const propertySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    images: [
      {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
      },
    ],

    title: {
      type: String,
      require: [true, "please enter title "],
    },
    description: {
      type: String,
      require: [true, "please enter the description "],
    },
    address: {
      type: String,
      require: [true, "please enter the address of your property"],
    },

    
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number], //longitude , latitude
    },

    capactiy: {
      type: Number,
      require: [true, "please enter the capcity of the persons"],
    },
    pricePerMonth: {
      type: Number,
      require: [true, "please enter the price "],
    },
    availablestartdate: {
      type: Date,
      require: [true, "please enter the availability of your property"],
    },
    availablityenddate: {
      type: Date,
      require: [true, "please enter the availability of end date"],
    },
    reviews: [
      {
        givenby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        ratings: {
          type: Number,
          min:0,
          max:5,
          default: 0,
        },
        addcomment: {
          type: String,
        },
        images: [
          {
            public_id: {
              type: String,
            },
            secret_url: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);
propertySchema.index({ location: "2dsphere" });
propertySchema.methods.checkAvailability = function (startDate) {
  return this.availablityenddate > new Date(startDate);
};
const propertymodel = model("Property", propertySchema);
export default propertymodel;
