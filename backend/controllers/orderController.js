import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order form frontend
const placeOrder = async (req,res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    })
    // saving order in db
    await newOrder.save();
    // clearing data stored in cart & resetting it
    await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}})
    // creating requred data by stripe payment api
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100 * 80
      },
      quantity: item.quantity
    }))

    line_items.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: 2*100*80
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    })

    res.json({success: true, session_url: session.url})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while connecting to Stripe api"})
  }
}

const verifyOrder = async (req, res) => {
  const {orderId, success} = req.body;

  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, {payment: true});
      res.json({success: true, message: "Successfully updated payment status"})
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({success: false, message: "Payment failed"});
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in updating payment details"});
  }
}

export { placeOrder, verifyOrder }; 