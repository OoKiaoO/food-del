import express from "express"
import cors from "cors"
import path from 'path'
import { fileURLToPath } from "url"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// Get --direname equivalent in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express()
const port = process.env.PORT || 4000;

// middleware
app.use(express.json())
app.use(cors())

// DB connection
connectDB();

// Serve static files from the frontend/assets dir
const assetsDir = path.join(__dirname, '../frontend/src/assets');
app.use('/assets', express.static(assetsDir))

// api endpoints
app.use("/api/food", foodRouter)
// app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)


app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`)
})
