import User from "../model/User.js";
import asyncHandler from "express-async-handler";

const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find();
	res.status(200).send(users);
});

const createUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		throw new Error("All Fields are Required");
	}
	const emailCheck = await User.isEmailUsed(email);
	if (emailCheck) {
		res.status(400);
		throw new Error("User Already Exists");
	}
	const user = new User({
		name,
		email,
		password,
	});

	await user.save();
	const token = await user.generateAuthToken();
	res.status(201).send({
		user,
		token,
	});
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findByCredentials(email, password);
	const token = await user.generateAuthToken();
	res.status(200).json({ user, token });
});

const getUser = asyncHandler(async (req, res) => {
	res.status(200).send(req.user);
});

const updateUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const user = await User.findById(req._id);
	user.name = name || user.name;
	user.email = email || user.email;
	if (password) {
		user.password = password;
	}
	await user.save();
	const token = await user.generateAuthToken();
	res.status(200).send({ user, token });
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(404);
		throw new Error("User Not Found");
	}
	await user.remove();
	res.status(200).send({ message: "User Deleted" });
});

const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(404);
		throw new Error("User Not Found");
	}
	res.status(200).send(user);
});

const updateUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;
	}
	const updatedUser = await user.save();
	res.status(200).send(updatedUser);
});

export {
	loginUser,
	createUser,
	getUser,
	updateUser,
	getUsers,
	deleteUser,
	getUserById,
	updateUserById,
};
