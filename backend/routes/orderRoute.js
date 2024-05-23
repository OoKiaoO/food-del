import express from "express";
import authMidlleware from "../middleware/auth.js"
import { placeOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMidlleware, placeOrder);

export default orderRouter;
