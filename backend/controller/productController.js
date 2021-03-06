import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";

const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? {
				name: { $regex: req.query.keyword, $options: "i" },
		  }
		: {};
	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	if (!products) {
		return res.status(404).send([]);
	}
	res.status(200).send({ products, page, pages: Math.ceil(count / pageSize) });
});

const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: "Sample Name",
		price: 0,
		user: req._id,
		image: "/images/sample.jpg",
		brand: "Sample Brand",
		category: "Sample Category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample Description",
	});
	await product.save();
	res.status(201).send(product);
});

const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } = req.body;
	const product = await Product.findById(req.params.id);
	if (!product) {
		res.status(404);
		throw new Error("Product Not Found");
	}
	product.name = name;
	product.price = price;
	product.description = description;
	product.image = image;
	product.brand = brand;
	product.category = category;
	product.countInStock = countInStock;

	await product.save();
	res.status(200).send(product);
});

const getProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(404).send("Product Not Found");
	}
	res.status(200).send(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(404).send("Product Not Found");
	}
	await product.remove();
	res.status(200).send({ message: "Product Deleted" });
});

const uplaodProductImage = asyncHandler(async (req, res) => {
	res.send(`/${req.file.path}`);
});

const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);
	if (!product) {
		res.status(404);
		throw new Error("Product Not Found");
	}
	const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req._id.toString());
	if (alreadyReviewed) {
		res.status(400);
		throw new Error("Product Already Reviewed");
	}
	const review = {
		name: req.user.name,
		rating: Number(rating),
		comment,
		user: req._id,
	};
	product.reviews.push(review);
	product.numReviews = product.reviews.length;
	product.rating =
		product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

	await product.save();
	res.status(201).send(product);
});

const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find().sort({ rating: -1 }).limit(3);
	res.json(products);
});

export {
	getProduct,
	getProducts,
	deleteProduct,
	createProduct,
	updateProduct,
	uplaodProductImage,
	createProductReview,
	getTopProducts,
};
