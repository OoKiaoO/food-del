// fil storing logic to connect ot db
import mongoose from "mongoose"

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://campalanichiara:vivlabam3@cluster0.jiynlun.mongodb.net/food-del').then(() => console.log("DB connected"))
}
