import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";

let createOrder = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;
	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No Order Items");
	}
	const order = new Order({
		orderItems,
		user: req._id,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	});
	await order.save();
	res.status(201).send(order);
});

const getOrder = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate("user", "name email");
	if (!order) {
		res.status(404);
		throw new Error("Order Not Found");
	}
	res.status(200);
	res.send(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
	const order = await Order.find({ user: req._id });
	if (!order) {
		res.status(404);
		throw new Error("Orders Not Found");
	}
	res.status(200);
	res.send(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
	const order = await Order.find().populate("user", "name email");
	if (!order) {
		res.status(404);
		throw new Error("Orders Not Found");
	}
	res.status(200);
	res.send(order);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		};
		const updatedOrder = await order.save();
		return res.status(200).send(updatedOrder);
	}
	res.status(404);
	throw new Error("Order Not Found");
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();
		const updatedOrder = await order.save();
		return res.status(200).send(updatedOrder);
	}
	res.status(404);
	throw new Error("Order Not Found");
});

export {
	createOrder,
	getOrder,
	updateOrderToPaid,
	getMyOrders,
	getAllOrders,
	updateOrderToDelivered,
};
