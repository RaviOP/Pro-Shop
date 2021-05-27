import express from "express";
import "./db/mongoose.js";
import cors from "cors";
import path from "path";
import colors from "colors";
import morgan from "morgan";
import productsRoute from "./routes/products.js";
import usersRoute from "./routes/users.js";
import ordersRoute from "./routes/orders.js";
import error from "./middleware/error.js";
import notFound from "./middleware/404.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(cors());
app.use(express.json());

app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));
app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);
app.use("/api/orders", ordersRoute);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/build")));

	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
	);
}

app.use(notFound);
app.use(error);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.magenta);
});
