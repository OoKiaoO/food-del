import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


//login user
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    // checking if user exists looking for email existence
    const user = await userModel.findOne({email});
    // if no match found, send error message
    if (!user) {
      return res.json({success: false, message: "User does not exit"});
    }
    // after finding user email match, sending user pass to bcrypt to check if entered pass matches the one stored in db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({success: false, message: "Invalid credentials"})
    }

    const token = createToken(user._id);
    res.json({success: true, token})

  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Failed login process"})
  }
}

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET)
}

// register user
const registerUser = async (req,res) => {
  // first destructuring data from req. body
  const { name, password, email } = req.body;

  try {
    // checking if user exists looking for email existence
    const exist = await userModel.findOne({email});
    if (exist) {
      return res.json({success: false, message: "User already exists"});
    }
    // validating email format & string password
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Please enter a valid email"});
    }// validating pass lenght 
    if (password.length < 8) {
      res.json({ success: false, message: "Please enter a strong password (>=8 char)"})
    }

    // hashing/ encrypting user password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    // creating new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPass,
    })

    const user = await newUser.save()
    const token = createToken(user._id)
    res.json({success: true, token})

  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while creating new user"})
  }
}

export { loginUser, registerUser } 
