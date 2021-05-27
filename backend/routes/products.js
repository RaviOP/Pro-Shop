import express from "express";
import {
	getProduct,
	getProducts,
	deleteProduct,
	createProduct,
	updateProduct,
	uplaodProductImage,
	createProductReview,
	getTopProducts,
} from "../controller/productController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/top", getTopProducts);
router.get("/:id", getProduct);

router.post("/", auth, admin, createProduct);
router.post("/:id/reviews", auth, createProductReview);
router.post("/upload", upload.single("image"), uplaodProductImage);

router.put("/:id", auth, admin, updateProduct);

router.delete("/:id", auth, admin, deleteProduct);

export default router;
