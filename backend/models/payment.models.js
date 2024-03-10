import mongoose, { model,Schema } from "mongoose";
const paymentSchema=new Schema({
    razorpay_order_id:{
        type:String,
        require:true
    },
    razorpay_payment_id:{
        type:String,
        require:true
    },
    razorpay_signature:{
        type:String,
        require:true
    }
});
const paymentmodel=model("payment",paymentSchema);
export default paymentmodel;