import express from "express";
import authMidlleware from "../middleware/auth.js"
import { listOrders, placeOrder, userOrders, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMidlleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMidlleware, userOrders);
orderRouter.get("/list", listOrders);

export default orderRouter;
