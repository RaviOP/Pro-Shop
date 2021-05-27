import express from "express";
import {
	loginUser,
	getUser,
	createUser,
	updateUser,
	getUsers,
	deleteUser,
	updateUserById,
	getUserById,
} from "../controller/userController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/", auth, admin, getUsers);
router.get("/profile", auth, getUser);
router.get("/:id", auth, admin, getUserById);

router.post("/", createUser);
router.post("/login", loginUser);

router.put("/profile", auth, updateUser);
router.put("/:id", auth, admin, updateUserById);

router.delete("/:id", auth, admin, deleteUser);

export default router;
