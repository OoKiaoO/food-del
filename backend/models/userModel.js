import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  cartData: {type: Object, default: {}},
}, {minimize: false})
// need to add "minimize" otherwise the cartData obj won't get created as empty obj

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
