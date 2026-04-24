const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
router.post("/create-order",async (req,res)=>{
    try{
        const{amount}= req.body;
        const options ={
            amount: amount *100 ,
            currency: "INR",
            receipt: "order_rcptid" + Date.now()
        };
        const order = await instance.orders.create(options);

        res.json(order);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

module.exports = router;