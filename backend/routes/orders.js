import express from "express";
import {
	createOrder,
	getAllOrders,
	getOrder,
	getMyOrders,
	updateOrderToPaid,
	updateOrderToDelivered,
} from "../controller/orderController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/", auth, admin, getAllOrders);
router.get("/myorders", auth, getMyOrders);
router.get("/:id", auth, getOrder);
router.post("/", auth, createOrder);
router.put("/:id/pay", auth, updateOrderToPaid);
router.put("/:id/deliver", auth, admin, updateOrderToDelivered);

export default router;
