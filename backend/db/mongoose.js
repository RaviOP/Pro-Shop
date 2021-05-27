import mongoose from "mongoose";

export default mongoose
	.connect(process.env.MONGODB_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log(`Connected to database`.cyan);
	})
	.catch((err) => {
		console.error(`Error : ${err}`.red.bold);
	});
