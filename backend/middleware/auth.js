import jwt from "jsonwebtoken"

// using middleware to authenticate user moving to cart section by using user token

const authMiddleware = async (req,res,next) => {
  // first retrieving token from headers
  const {token} = req.headers;
  if (!token) {
    return response.json({success: false, message: "Not authorized, please login again"})
  }
  try {
    // if we retieved token successfully, we need to decode it using the secret stored in .env file
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    // at the time of token encryption, we have access to an obj containing the user_id, which we can now retrieve
    // by using the user_id we will retrieve the user data from the cart
    req.body.userId = token_decode.id;
    // calling callback function
    next();
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error retrieveing user token"})
  }

}

export default authMiddleware;
