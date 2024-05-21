import express from "express"
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js";

// creating express router
const cartRouter = express.Router();

// creating routes associated w/ cartRouter
cartRouter.post("/add", authMiddleware, addToCart)
cartRouter.post("/remove", authMiddleware, removeFromCart)
cartRouter.get("/get", authMiddleware, getCart)

export default cartRouter
