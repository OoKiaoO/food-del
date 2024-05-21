import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req,res) => {
  try {
    // getting user id info which will be extracted by middleware function
    let userData = await userModel.findOne({_id: req.body.userId})
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    // updating cart data in db
    await userModel.findByIdAndUpdate(req.body.userId, {cartData});
    // creating success response
    res.json({success: true, message: "Added to Cart"})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while updating cart data"})
  }
}

// remove items from user cart
const removeFromCart = async (req,res) => {
  try {
    // first fid user id thru middleware token function
    let userData = await userModel.findById(req.body.userId);
    // extract cart Data from userModel
    let cartData = await userData.cartData;
    // check if there are quantities present in the cart
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    // updating cart data in userModel & sending response
    await userModel.findByIdAndUpdate(req.body.userId, {cartData});
    res.json({success: true, message: "Removed from Cart"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error updating Cart Data"});
  }
}

// fetch user cart data
const getCart = async (req,res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({success: true, cartData});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while fetching cart data"})
  }
}

export { addToCart, removeFromCart, getCart }
