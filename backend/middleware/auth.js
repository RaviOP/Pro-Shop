import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
	try {
		const token = req.header("Authorization");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req._id = decoded._id;
		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ message: "You are Not Authorized" });
	}
};

export default auth;
