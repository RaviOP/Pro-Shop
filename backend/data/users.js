import bcrypt from "bcryptjs";

const users = [
	{
		name: "Admin",
		email: "admin@gmail.com",
		password: bcrypt.hashSync("Admin@12345", 10),
		isAdmin: true,
	},
	{
		name: "Ravi",
		email: "ravi@gmail.com",
		password: bcrypt.hashSync("Ravi@12345", 10),
		isAdmin: true,
	},
	{
		name: "Test",
		email: "test@gmail.com",
		password: bcrypt.hashSync("Test@12345", 10),
	},
];

export default users;
