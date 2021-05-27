import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";

import Product from "./model/Product.js";
import User from "./model/User.js";
import Order from "./model/Order.js";
import "./db/mongoose.js";

const importData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		const createdUser = await User.insertMany(users);

		const admin = createdUser[0]._id;
		const sampleProducts = products.map((product) => {
			return { ...product, user: admin };
		});
		await Product.insertMany(sampleProducts);

		console.log("Data Imported".green.inverse);
		process.exit();
	} catch (error) {
		console.error(`Error: ${error}`.red.inverse);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		console.log("Data Destroyed".red.inverse);
		process.exit();
	} catch (error) {
		console.error(`Error: ${error}`.red.inverse);
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
