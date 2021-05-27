const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		return next();
	}
	res.status(401);
	throw new Error("Not Authorized as an Admin");
};

export default admin;
