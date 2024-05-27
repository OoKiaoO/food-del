// file storing logic to connect ot db
import mongoose from "mongoose"

export const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    console.error("MONGODB_URI is not defined in the envronment variables");
    process.exit(1);
  }

  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("DB connected"))
  .catch(err => {
    console.error("DB connection error:",err);
    process.exit(1);
  })
}
